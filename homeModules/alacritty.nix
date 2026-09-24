{ config, lib, theme ? import ../themes/default.nix, ... }:

let
  c = theme.colors;
  f = theme.fonts;
  s = theme.layout.spacing;
in
{
  options.flatwork.alacritty.enable = lib.mkOption {
    type = lib.types.bool;
    default = true;
    description = "Enable Alacritty terminal styling.";
  };

  config = lib.mkIf config.flatwork.alacritty.enable {
      programs.alacritty = {
        enable = true;

        settings = {
          window = {
            padding = {
              x = s.md * 3;
              y = s.md * 3;
            };
          };

          font = {
            normal.family = f.mono;
            size = f.sizes.ui;
          };

          colors = {
            primary = {
              background = c.terminal.background;
              foreground = c.terminal.foreground;
            };

            cursor = {
              text = c.terminal.background;
              cursor = c.terminal.cursor;
            };

            selection = {
              text = c.terminal.background;
              background = c.states.active;
            };

            normal = {
              inherit (c.terminal) black red green yellow blue magenta cyan white;
            };

            bright = {
              black = c.terminal.brightBlack;
              red = c.terminal.brightRed;
              green = c.terminal.brightGreen;
              yellow = c.terminal.brightYellow;
              blue = c.terminal.brightBlue;
              magenta = c.terminal.brightMagenta;
              cyan = c.terminal.brightCyan;
              white = c.terminal.brightWhite;
            };
          };

          cursor.style = "Block";
        };
      };
  };
}
