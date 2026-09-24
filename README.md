# Jurre Theme

Reusable Nix flake for Jurre's desktop design system: a modern dark, academic/technical interface with STIX Two Text, IBM Plex Mono, muted colors, square corners, 1px borders, flat surfaces, and no decorative shadows.

The design intent lives in [`DESIGN.MD`](./DESIGN.MD). The machine-readable tokens live in [`themes/hue-gradient-design.nix`](./themes/hue-gradient-design.nix).

This flake contains the reusable desktop theme plus selected full-experience app modules. Firefox and Waybar intentionally include Jurre's UI/workflow defaults so consumers get the same browser/bar experience. Machine/session config such as WM keybinds, monitor names, startup apps, and personal paths should still live in the consuming config.

## Exports

- `lib.themes.default` / `lib.themes.hue-gradient-design` — theme tokens
- `homeManagerModules.default` / `homeModules.default` — desktop + app styling bundle
- `homeManagerModules.desktop` — GTK, Mako, full Waybar config/style, Rofi theme, SwayOSD CSS
- `homeManagerModules.apps` — Alacritty colors, full Firefox config/CSS, Fastfetch colors, Bash prompt
- individual Home Manager modules, e.g. `homeManagerModules.gtk`, `homeManagerModules.alacritty`, `homeManagerModules.bash-prompt`
- `nixosModules.fonts` — system font packages
- `overlays.default` — compatibility overlay for `ibm-plex-mono-nerd`

## Example usage

```nix
{
  inputs.jurre-theme.url = "github:jurrebuunk/jurre-theme";

  outputs = inputs@{ nixpkgs, home-manager, jurre-theme, ... }: {
    nixosConfigurations.myhost = nixpkgs.lib.nixosSystem {
      system = "x86_64-linux";
      modules = [
        jurre-theme.nixosModules.fonts
        home-manager.nixosModules.home-manager
        {
          home-manager.extraSpecialArgs = {
            theme = jurre-theme.lib.themes.default;
          };

          home-manager.users.me.imports = [
            jurre-theme.homeManagerModules.default
          ];
        }
      ];
    };
  };
}
```

If you only want the tokens, set `theme = jurre-theme.lib.themes.default;` and keep your own modules.
