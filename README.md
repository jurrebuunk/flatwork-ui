# Jurre Theme

Reusable Nix flake for Jurre's desktop design system: a modern dark, academic/technical interface with STIX Two Text, IBM Plex Mono, muted colors, square corners, 1px borders, flat surfaces, and no decorative shadows.

The design intent lives in [`DESIGN.MD`](./DESIGN.MD). The machine-readable tokens live in [`themes/hue-gradient-design.nix`](./themes/hue-gradient-design.nix).

## Exports

- `lib.themes.default` / `lib.themes.hue-gradient-design` — theme tokens
- `homeModules.default` — desktop + app theming bundle
- `homeModules.desktop` — GTK, Mako, Waybar, Rofi, SwayOSD
- `homeModules.apps` — Alacritty, Firefox, Fastfetch, Obsidian, Supersonic, LibreOffice, Bash prompt
- individual Home Manager modules, e.g. `homeModules.gtk`, `homeModules.alacritty`
- `homeModules.sway-style` — Sway visual styling only
- `homeModules.niri-opinionated` — copied opinionated Niri session config; import explicitly only if wanted
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
            jurre-theme.homeModules.default
            # Optional WM styling:
            # jurre-theme.homeModules.sway-style
            # jurre-theme.homeModules.niri-opinionated
          ];
        }
      ];
    };
  };
}
```

If you only want the tokens, set `theme = jurre-theme.lib.themes.default;` and keep your own modules.
