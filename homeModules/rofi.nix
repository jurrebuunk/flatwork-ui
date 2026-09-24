{ theme ? import ../themes/default.nix, ... }:

let
  c = theme.colors;
  f = theme.fonts;
  g = theme.geometry;
  s = theme.layout.spacing;

  notificationWidth = theme.layout.notification.width;
  panelHeight = theme.layout.notification.width;
  panelMargin = s.xl;
  panelPadding = s.lg;
in
{
  programs.rofi = {
    enable = true;
    extraConfig = {
      show-icons = false;
      icon-theme = theme.icons.name;
      display-drun = "app";
      display-run = "command";
      font = "${f.serif} ${toString f.sizes.serifUi}";
    };

    theme = {
      "*" = {
        background = c.background;
        background-color = c.background;
        foreground = c.text;
        border-color = c.border;
        separatorcolor = c.border;
        scrollbar-handle = c.border;

        normal-background = c.background;
        normal-foreground = c.text;
        alternate-normal-background = c.background;
        alternate-normal-foreground = c.text;

        selected-normal-background = c.states.active;
        selected-normal-foreground = c.background;
        active-background = c.states.active;
        active-foreground = c.background;
        urgent-background = c.error;
        urgent-foreground = c.background;
      };

      window = {
        location = "west";
        anchor = "west";
        x-offset = panelMargin;
        y-offset = 0;
        width = notificationWidth;
        height = panelHeight;
        padding = 0;
        # Match the window treatment used elsewhere: a background-colored
        # outer frame around the normal 1px structural border.
        border = "3px";
        border-color = c.background;
        background-color = c.background;
        children = [ "mainbox" ];
      };

      mainbox = {
        orientation = "vertical";
        children = [ "inputbar" "listview" ];
        spacing = 0;
        padding = 0;
        border = g.border.widthPx;
        border-color = c.border;
        background-color = c.background;
      };

      inputbar = {
        orientation = "horizontal";
        children = [ "entry" ];
        padding = "${toString panelPadding}px";
        border = "0px 0px ${g.border.widthPx} 0px";
        border-color = c.border;
        background-color = c.background;
      };

      entry = {
        expand = true;
        placeholder = "launch…";
        placeholder-color = c.textMuted;
        text-color = c.text;
        cursor-color = c.terminal.cursor;
        background-color = c.background;
      };

      listview = {
        layout = "vertical";
        flow = "vertical";
        lines = 10;
        fixed-height = false;
        dynamic = true;
        scrollbar = false;
        spacing = s.xs;
        padding = "${toString panelPadding}px";
        background-color = c.background;
      };

      element = {
        orientation = "horizontal";
        children = [ "element-text" ];
        padding = "${toString s.xs}px ${toString s.sm}px";
        background-color = c.background;
        text-color = c.text;
      };

      "element selected.normal" = {
        background-color = c.states.active;
        text-color = c.background;
      };

      element-text = {
        vertical-align = "0.5";
        background-color = "transparent";
        text-color = "inherit";
      };
    };
  };
}
