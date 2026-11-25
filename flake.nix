{
  description = "Flatwork UI: design system, themes and component libraries, plus a Niri desktop Home Manager experience";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
  };

  outputs = { self, nixpkgs, ... }:
    let
      systems = [ "x86_64-linux" "aarch64-linux" ];
      forAllSystems = nixpkgs.lib.genAttrs systems;
      lib = nixpkgs.lib;
      # Every folder in ./themes is a theme: tokens.nix + DESIGN.md + components/.
      themeDirs = lib.attrNames (lib.filterAttrs (_: type: type == "directory") (builtins.readDir ./themes));
      namedThemes = lib.genAttrs themeDirs (name: import ./themes/${name});
      themes = namedThemes // { default = import ./themes/default.nix; };
      themeLib = import ./lib/theme.nix { inherit lib; };
    in
    {
      lib = themeLib // {
        inherit themes;
      };

      overlays.default = import ./overlays/default.nix;

      nixosModules = {
        default = ./nixosModules/fonts.nix;
        fonts = ./nixosModules/fonts.nix;
      };

      homeModules = {
        default = ./homeModules/default.nix;
        style = ./homeModules/style.nix;
        experience = ./homeModules/experience.nix;
        desktop = ./homeModules/desktop.nix;
        apps = ./homeModules/apps.nix;

        gtk = ./homeModules/gtk.nix;
        mako = ./homeModules/mako.nix;
        waybar = ./homeModules/waybar.nix;
        rofi = ./homeModules/rofi.nix;
        swayosd = ./homeModules/swayosd.nix;
        alacritty = ./homeModules/alacritty.nix;
        firefox = ./homeModules/firefox.nix;
        fastfetch = ./homeModules/fastfetch.nix;
        bash-prompt = ./homeModules/bash-prompt.nix;
      };

      # Conventional alias used by many flakes.
      homeManagerModules = self.homeModules;

      packages = forAllSystems (system:
        let
          pkgs = nixpkgs.legacyPackages.${system};
          theme = themes.default;
          # A theme's full package: tokens as CSS/JSON, its design system and its components.
          # Web themes (with tokens.json) are built by the same script as the npm package,
          # producing tokens.css and one bundled <name>.css; desktop themes export vars.css.
          isWebTheme = name: builtins.pathExists ./themes/${name}/tokens.json;
          mkThemePackage = name: theme: pkgs.runCommand "flatwork-theme-${name}" { nativeBuildInputs = [ pkgs.nodejs ]; } (''
            mkdir -p "$out"
            cp ${theme.design} "$out/DESIGN.md"
            cp -R ${theme.components} "$out/components"
          '' + (if isWebTheme name then ''
            node ${./scripts/build-theme-css.mjs} ${./themes/${name}} "$out"
          '' else ''
            cp ${pkgs.writeText "palette.json" (themeLib.themeToJson theme)} "$out/palette.json"
            cp ${pkgs.writeText "vars.css" (themeLib.themeToCssVars theme)} "$out/vars.css"
          ''));
          themePackages = lib.mapAttrs' (name: theme: lib.nameValuePair "theme-${name}" (mkThemePackage name theme)) namedThemes;
          releaseVersion = self.shortRev or "dev";
        in
        {
          palette-json = pkgs.writeText "flatwork-palette.json" (themeLib.themeToJson theme);
          css-vars = pkgs.writeText "flatwork-vars.css" (themeLib.themeToCssVars theme);

          all-theme-files = pkgs.runCommand "flatwork-theme-files" { } ''
            mkdir -p "$out/themes"
            ${lib.concatMapStringsSep "\n" (name: ''cp -R ${themePackages."theme-${name}"} "$out/themes/${name}"'') themeDirs}
          '';

          wallpapers = pkgs.runCommand "flatwork-wallpapers" { } ''
            mkdir -p "$out"
            ${lib.concatMapStringsSep "\n" (name: ''cp -R ${./themes/${name}/wallpapers}/. "$out/"'') (lib.filter (name: builtins.pathExists ./themes/${name}/wallpapers) themeDirs)}
          '';

          release-bundle = pkgs.runCommand "flatwork-ui-${releaseVersion}.tar.gz" { } ''
            bundle="flatwork-ui-${releaseVersion}"
            mkdir -p "$bundle"

            cp ${./README.md} "$bundle/README.md"
            cp ${./PROMPT.md} "$bundle/PROMPT.md"
            cp -R ${./docs} "$bundle/docs"
            cp -R ${self.packages.${system}.all-theme-files} "$bundle/theme-files"
            cp -R ${self.packages.${system}.wallpapers} "$bundle/wallpapers"

            ${pkgs.gnutar}/bin/tar -czf "$out" "$bundle"
          '';

          default = self.packages.${system}.css-vars;
        } // themePackages
      );

      checks = forAllSystems (system:
        let
          pkgs = nixpkgs.legacyPackages.${system};
        in
        {
          no-hardcoded-local-theme-paths = pkgs.runCommand "flatwork-no-local-theme-paths" { src = self; } ''
            if ${pkgs.gnugrep}/bin/grep -R --exclude=flake.nix "/home/jurre/nixos" "$src"; then
              echo "Found hardcoded /home/jurre/nixos path" >&2
              exit 1
            fi
            touch $out
          '';

          themes-are-complete = pkgs.runCommand "flatwork-themes-are-complete" { } ''
            ${lib.concatMapStringsSep "\n" (name: ''
              for part in tokens.nix default.nix DESIGN.md components/index.css; do
                test -e ${./themes/${name}}/$part || { echo "theme ${name} is missing $part" >&2; exit 1; }
              done
            '') themeDirs}
            touch $out
          '';

          no-old-theme-schema = pkgs.runCommand "flatwork-no-old-theme-schema" { src = self; } ''
            if ${pkgs.gnugrep}/bin/grep -R --exclude=flake.nix "colors\.\(bg\|fg\|gray\|blue\|green\|yellow\|orange\|magenta\|cyan\)" "$src"; then
              echo "Found old theme schema reference" >&2
              exit 1
            fi
            touch $out
          '';
        }
      );

      formatter = forAllSystems (system: nixpkgs.legacyPackages.${system}.nixpkgs-fmt);
    };
}
