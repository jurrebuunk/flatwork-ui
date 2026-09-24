{ config, pkgs, theme ? import ../themes/default.nix, ... }:

let
  c = theme.colors;
  f = theme.fonts;
  g = theme.geometry;
  s = theme.layout.spacing;

  rofiLauncher = ''
    configuration {
      show-icons: false;
      icon-theme: "${theme.icons.name}";
      display-drun: "app";
      display-run: "command";
      font: "${f.serif} ${toString f.sizes.serifUi}";
    }

    window {
      location: north;
      anchor: north;
      x-offset: 0px;
      y-offset: 0px;
      width: 100%;
      height: ${toString theme.layout.bar.height}px;
      padding: 0px;
      border: 0px 0px ${g.border.widthPx} 0px;
      border-color: ${c.border};
      children: [ horibox ];
    }

    horibox {
      orientation: horizontal;
      children: [ inputbar, listview ];
      spacing: ${toString s.md}px;
      padding: 0px ${toString s.sm}px;
      background-color: ${c.background};
    }

    inputbar {
      orientation: horizontal;
      children: [ entry ];
      expand: false;
      width: 28%;
      padding: 0px;
      background-color: ${c.background};
    }

    entry {
      expand: true;
      placeholder: "launch…";
      placeholder-color: ${c.textMuted};
      text-color: ${c.text};
      cursor-color: ${c.terminal.cursor};
      background-color: ${c.background};
    }

    listview {
      layout: horizontal;
      flow: horizontal;
      lines: 1;
      columns: 5;
      fixed-height: true;
      dynamic: true;
      scrollbar: false;
      spacing: ${toString s.xs}px;
      padding: 0px;
      background-color: ${c.background};
    }

    element {
      orientation: horizontal;
      children: [ element-text ];
      padding: 0px ${toString s.sm}px;
      background-color: ${c.background};
      text-color: ${c.text};
    }

    element selected.normal {
      background-color: ${c.states.active};
      text-color: ${c.background};
    }

    element-text {
      vertical-align: 0.5;
      background-color: transparent;
      text-color: inherit;
    }

    * {
      background: ${c.background};
      background-color: ${c.background};
      foreground: ${c.text};
      border-color: ${c.border};
      separatorcolor: ${c.border};
      scrollbar-handle: ${c.border};

      normal-background: ${c.background};
      normal-foreground: ${c.text};

      alternate-normal-background: ${c.background};
      alternate-normal-foreground: ${c.text};

      selected-normal-background: ${c.states.active};
      selected-normal-foreground: ${c.background};

      active-background: ${c.states.active};
      active-foreground: ${c.background};
      alternate-active-background: ${c.states.active};
      alternate-active-foreground: ${c.background};
      selected-active-background: ${c.states.active};
      selected-active-foreground: ${c.background};

      urgent-background: ${c.error};
      urgent-foreground: ${c.background};
      alternate-urgent-background: ${c.error};
      alternate-urgent-foreground: ${c.background};
      selected-urgent-background: ${c.error};
      selected-urgent-foreground: ${c.background};
    }
  '';

  piLauncher = ''
    configuration {
      show-icons: false;
      font: "${f.mono} ${toString f.sizes.ui}";
    }

    window {
      width: 30%;
      border: ${g.border.widthPx};
      border-color: ${c.border};
      background-color: ${c.background};
    }

    mainbox {
      children: [ inputbar, listview ];
      spacing: 0px;
      padding: 0px;
      background-color: ${c.background};
    }

    inputbar {
      children: [ prompt, entry ];
      spacing: ${toString s.md}px;
      padding: ${toString s.md}px ${toString s.lg}px;
      border: ${g.border.widthPx};
      border-color: ${c.border};
      background-color: ${c.background};
    }

    prompt {
      background-color: ${c.background};
      text-color: ${c.textMuted};
    }

    entry {
      background-color: ${c.background};
      placeholder: "Ask pi…";
      placeholder-color: ${c.textMuted};
      text-color: ${c.text};
      cursor-color: ${c.terminal.cursor};
    }

    listview {
      lines: 6;
      fixed-height: false;
      padding: ${toString s.xs}px 0px 0px 0px;
      spacing: ${toString s.xxs}px;
      background-color: ${c.background};
    }

    element {
      padding: ${toString s.xs}px ${toString s.sm}px;
      background-color: ${c.background};
      text-color: ${c.text};
    }

    element selected.normal {
      background-color: ${c.states.active};
      text-color: ${c.background};
    }
  '';
in
{
  home.file.".local/bin/rofi-bar-launcher" = {
    executable = true;
    text = ''
      #!/bin/sh
      mode="''${1:-drun}"
      had_waybar=0
      restored_waybar=0

      restore_waybar() {
        if [ "$had_waybar" -eq 1 ] && [ "$restored_waybar" -eq 0 ]; then
          restored_waybar=1
          nohup ${pkgs.waybar}/bin/waybar >"${config.xdg.cacheHome}/waybar.log" 2>&1 &
        fi
      }
      trap restore_waybar EXIT
      trap 'restore_waybar; exit 130' INT
      trap 'restore_waybar; exit 143' TERM

      if ${pkgs.procps}/bin/pgrep -x waybar >/dev/null 2>&1; then
        had_waybar=1
        ${pkgs.procps}/bin/pkill -x waybar >/dev/null 2>&1 || true
        sleep 0.05
      fi

      ${pkgs.rofi}/bin/rofi -show "$mode"
      status=$?
      exit "$status"
    '';
  };

  xdg.configFile."rofi/config.rasi" = {
    text = rofiLauncher;
    force = true;
  };

  xdg.configFile."rofi/pi.rasi" = {
    text = piLauncher;
    force = true;
  };
}
