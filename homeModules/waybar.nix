{ theme ? import ../themes/default.nix, ... }:

let
  c = theme.colors;
  f = theme.fonts;
  g = theme.geometry;
  spacing = theme.layout.spacing;
  barContentHeight = theme.layout.bar.height - 4;
  barInset = 4;
in
{
  programs.waybar = {
    enable = true;

    style = ''
      * {
        border: none;
        border-radius: ${g.radiusPx};
        font: ${toString f.sizes.serifUi}pt "${f.serif}";
        font-family: "${f.serif}";
        font-size: ${toString f.sizes.serifUi}pt;
        font-style: normal;
        font-weight: 400;
        min-height: 0;
        margin: 0;
        padding: 0;
      }

      label {
        font: ${toString f.sizes.serifUi}pt "${f.serif}";
        font-family: "${f.serif}";
        font-size: ${toString f.sizes.serifUi}pt;
        font-style: normal;
        font-weight: 400;
      }

      window#waybar {
        background-color: ${c.background};
        color: ${c.text};
        border-left: 3px solid ${c.background};
        border-right: 3px solid ${c.background};
        border-top: 3px solid ${c.background};
        border-bottom: none;
        box-shadow: inset 1px 0 0 0 ${c.border}, inset -1px 0 0 0 ${c.border}, inset 0 1px 0 0 ${c.border};
      }

      #workspaces {
        margin: ${toString barInset}px 0 0 ${toString barInset}px;
        padding: 0;
      }

      #workspaces button {
        padding: 0;
        margin: 0;
        min-width: ${toString barContentHeight}px;
        min-height: ${toString barContentHeight}px;
        color: ${c.text};
        background: ${c.background};
      }

      #workspaces button.active,
      #workspaces button.visible,
      #workspaces button.focused,
      #workspaces button.current,
      #workspaces button:hover {
        color: ${c.text};
        background: ${c.border};
      }

      #workspaces button.urgent {
        color: ${c.text};
        background: ${c.error};
      }

      #clock,
      #cpu,
      #memory,
      #temperature,
      #backlight,
      #network,
      #pulseaudio,
      #battery,
      #tray,
      #custom-pi {
        padding: 0 ${toString spacing.xxs}px;
        color: ${c.text};
        margin-top: ${toString barInset}px;
        min-height: ${toString barContentHeight}px;
      }

      #clock {
        margin-right: ${toString barInset}px;
      }

      #temperature.critical,
      #network.disconnected,
      #pulseaudio.muted,
      #battery.warning,
      #battery.critical {
        color: ${c.text};
      }

      #battery.critical:not(.charging) {
        opacity: 0.65;
      }
    '';
  };
}
