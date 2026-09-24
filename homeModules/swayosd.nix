{ config, lib, theme ? import ../themes/default.nix, ... }:

let
  c = theme.colors;
  g = theme.geometry;
  spacing = theme.layout.spacing;
  topMarginPx = spacing.xl;
  # swayosd's top_margin is a screen-height ratio. Keep the default aligned
  # with Mako/Rofi's 16px theme margin on the 1080px laptop panel.
  topMarginRatio = "0.015";
in
{
  options.flatwork.swayosd.enable = lib.mkOption {
    type = lib.types.bool;
    default = true;
    description = "Enable SwayOSD styling.";
  };

  config = lib.mkIf config.flatwork.swayosd.enable {
      xdg.configFile."swayosd/config.toml".text = ''
        [server]
        # Same visual top gap as Mako/Rofi: ${toString topMarginPx}px on the main panel.
        top_margin = ${topMarginRatio}
        min_brightness = 5
        show_percentage = true

        [client]
      '';

      xdg.configFile."swayosd/style.css".text = ''
        window#osd {
          min-height: 40px;
          margin-top: ${toString topMarginPx}px;
          border-radius: ${g.radiusPx};
          border: ${g.border.widthPx} solid ${c.accent};
          background: ${c.background};
          color: ${c.text};
        }

        window#osd #container {
          margin: ${toString spacing.lg}px;
        }

        window#osd image,
        window#osd label {
          color: ${c.text};
          font-size: ${toString theme.fonts.sizes.ui}pt;
        }

        window#osd image {
          -gtk-icon-size: 14px;
        }

        window#osd progressbar:disabled,
        window#osd image:disabled {
          opacity: 0.5;
        }

        window#osd progressbar,
        window#osd segmentedprogress {
          min-height: 4px;
          min-width: 180px;
          border-radius: ${g.radiusPx};
          background: transparent;
          border: none;
        }

        window#osd trough,
        window#osd segment {
          min-height: inherit;
          border-radius: ${g.radiusPx};
          border: none;
          background: ${c.border};
        }

        window#osd progress,
        window#osd segment.active {
          min-height: inherit;
          border-radius: ${g.radiusPx};
          border: none;
          background: ${c.accent};
        }

        window#osd segment {
          margin-left: ${toString spacing.xs}px;
        }

        window#osd segment:first-child {
          margin-left: 0;
        }
      '';
  };
}
