{ config, lib, theme ? import ../themes/default.nix, ... }:

let
  inherit (config.lib.formats.rasi) mkLiteral;

  c = theme.colors;
  f = theme.fonts;
  g = theme.geometry;
  s = theme.layout.spacing;

  lit = mkLiteral;
  color = mkLiteral;
  px = n: mkLiteral "${toString n}px";

  notificationWidth = theme.layout.notification.width;
  panelHeight = theme.layout.notification.width;
  panelMargin = s.xl;
  panelPadding = s.lg;
in
{
  options.flatwork.rofi.enable = lib.mkOption {
    type = lib.types.bool;
    default = true;
    description = "Enable Rofi launcher styling.";
  };

  config = lib.mkIf config.flatwork.rofi.enable {
      programs.rofi = {
        enable = true;
        extraConfig = {
          show-icons = false;
          icon-theme = theme.icons.name;
          display-drun = "app";
          display-run = "command";
          font = "${f.serif} ${toString f.sizes.serifUi}";

          # Rofi's configuration-level location overrides the theme's window
          # location. Keep this in sync with the theme window block.
          location = 1; # north west
          xoffset = panelMargin;
          yoffset = panelMargin;
        };

        theme = {
          "*" = {
            background = color c.background;
            background-color = color c.background;
            foreground = color c.text;
            border-color = color c.border;
            separatorcolor = color c.border;
            scrollbar-handle = color c.border;

            normal-background = color c.background;
            normal-foreground = color c.text;
            alternate-normal-background = color c.background;
            alternate-normal-foreground = color c.text;

            selected-normal-background = color c.states.active;
            selected-normal-foreground = color c.background;
            active-background = color c.states.active;
            active-foreground = color c.background;
            urgent-background = color c.error;
            urgent-foreground = color c.background;
          };

          window = {
            location = lit "north west";
            anchor = lit "north west";
            x-offset = px panelMargin;
            y-offset = px panelMargin;
            width = notificationWidth;
            height = panelHeight;
            padding = 0;
            # Match the window treatment used elsewhere: a background-colored
            # outer frame around the normal 1px structural border.
            border = px 3;
            border-color = color c.background;
            background-color = color c.background;
            children = map lit [ "mainbox" ];
          };

          mainbox = {
            orientation = lit "vertical";
            children = map lit [ "inputbar" "listview" ];
            spacing = 0;
            padding = 0;
            border = mkLiteral g.border.widthPx;
            border-color = color c.border;
            background-color = color c.background;
          };

          inputbar = {
            orientation = lit "horizontal";
            children = map lit [ "entry" ];
            padding = px panelPadding;
            border = lit "0px 0px ${g.border.widthPx} 0px";
            border-color = color c.border;
            background-color = color c.background;
          };

          entry = {
            expand = true;
            placeholder = "launch…";
            placeholder-color = color c.textMuted;
            text-color = color c.text;
            cursor-color = color c.terminal.cursor;
            background-color = color c.background;
          };

          listview = {
            layout = lit "vertical";
            flow = lit "vertical";
            lines = 10;
            fixed-height = false;
            dynamic = true;
            scrollbar = false;
            spacing = s.xs;
            padding = px panelPadding;
            background-color = color c.background;
          };

          element = {
            orientation = lit "horizontal";
            children = map lit [ "element-text" ];
            padding = lit "${toString s.xs}px ${toString s.sm}px";
            background-color = color c.background;
            text-color = color c.text;
          };

          "element normal.normal" = {
            background-color = color c.background;
            text-color = color c.text;
          };

          "element alternate.normal" = {
            background-color = color c.background;
            text-color = color c.text;
          };

          "element selected.normal" = {
            background-color = color c.states.active;
            text-color = color c.background;
          };

          element-icon = {
            background-color = lit "inherit";
            text-color = lit "inherit";
          };

          element-text = {
            vertical-align = lit "0.5";
            background-color = lit "inherit";
            text-color = lit "inherit";
          };

          scrollbar = {
            background-color = color c.background;
            handle-color = color c.border;
          };
        };
      };
  };
}
