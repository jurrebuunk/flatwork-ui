{
  description = "Flatwork UI: a precise dark Niri desktop theme and Home Manager experience";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
  };

  outputs = { self, nixpkgs, ... }:
    let
      systems = [ "x86_64-linux" "aarch64-linux" ];
      forAllSystems = nixpkgs.lib.genAttrs systems;
      themes = {
        default = import ./themes/default.nix;
        hue-gradient-design = import ./themes/hue-gradient-design.nix;
        gruvbox = import ./themes/gruvbox.nix;
        starship = import ./themes/starship.nix;
        teal = import ./themes/teal.nix;
        orange = import ./themes/orange.nix;
      };
      themeLib = import ./lib/theme.nix { lib = nixpkgs.lib; };
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
        in
        {
          palette-json = pkgs.writeText "flatwork-palette.json" (themeLib.themeToJson theme);
          css-vars = pkgs.writeText "flatwork-vars.css" (themeLib.themeToCssVars theme);
          default = self.packages.${system}.css-vars;
        }
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
