{ theme ? import ../themes/default.nix, ... }:

let
  c = theme.colors;
  f = theme.fonts;
  g = theme.geometry;
  s = theme.layout.spacing;
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
        location = "north";
        anchor = "north";
        x-offset = 0;
        y-offset = 0;
        width = "100%";
        height = theme.layout.bar.height;
        padding = 0;
        border = "0px 0px ${g.border.widthPx} 0px";
        border-color = c.border;
        children = [ "horibox" ];
      };

      horibox = {
        orientation = "horizontal";
        children = [ "inputbar" "listview" ];
        spacing = s.md;
        padding = "0px ${toString s.sm}px";
        background-color = c.background;
      };

      inputbar = {
        orientation = "horizontal";
        children = [ "entry" ];
        expand = false;
        width = "28%";
        padding = 0;
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
        layout = "horizontal";
        flow = "horizontal";
        lines = 1;
        columns = 5;
        fixed-height = true;
        dynamic = true;
        scrollbar = false;
        spacing = s.xs;
        padding = 0;
        background-color = c.background;
      };

      element = {
        orientation = "horizontal";
        children = [ "element-text" ];
        padding = "0px ${toString s.sm}px";
        background-color = c.background;
        text-color = c.text;
      };

      "element selected.normal" = {
        background-color = c.states.active;
        text-color = c.background;
      };

      element-text = {
        vertical-align = 0.5;
        background-color = "transparent";
        text-color = "inherit";
      };
    };
  };
}
