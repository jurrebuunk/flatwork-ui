{
  description = "Jurre's reusable desktop theme flake";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
  };

  outputs = { self, nixpkgs, ... }:
    let
      systems = [ "x86_64-linux" "aarch64-linux" ];
      forAllSystems = nixpkgs.lib.genAttrs systems;
    in
    {
      lib.themes = {
        default = import ./themes/default.nix;
        hue-gradient-design = import ./themes/hue-gradient-design.nix;
      };

      overlays.default = import ./overlays/default.nix;

      nixosModules = {
        default = ./nixosModules/fonts.nix;
        fonts = ./nixosModules/fonts.nix;
      };

      homeModules = {
        default = ./homeModules/default.nix;
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
        obsidian = ./homeModules/obsidian.nix;
        supersonic = ./homeModules/supersonic.nix;
        libreoffice = ./homeModules/libreoffice.nix;
        bash-prompt = ./homeModules/bash-prompt.nix;

        # More opinionated/session-level modules; import explicitly if wanted.
        sway-style = ./homeModules/sway-style.nix;
        niri-opinionated = ./homeModules/niri-opinionated.nix;
      };

      formatter = forAllSystems (system: nixpkgs.legacyPackages.${system}.nixpkgs-fmt);
    };
}
