{ config, pkgs, lib, theme ? import ../themes/default.nix, ... }:

let
  c = theme.colors;
  f = theme.fonts;
  g = theme.geometry;
  spacing = theme.layout.spacing;
  barContentHeight = theme.layout.bar.height - 4;
  barInset = 4;
  cfg = config.jurre.theme.waybar;
  temperatureModule = {
    interval = cfg.temperature.interval;
    input-filename = cfg.temperature.inputFilename;
    critical-threshold = cfg.temperature.criticalThreshold;
    format = cfg.temperature.format;
    tooltip = cfg.temperature.tooltip;
  } // lib.optionalAttrs (cfg.temperature.hwmonPath != null) {
    hwmon-path-abs = cfg.temperature.hwmonPath;
  };
in
{
  options.jurre.theme.waybar = {
    modulesRight = lib.mkOption {
      type = lib.types.listOf lib.types.str;
      default = [ "temperature" "memory" "backlight" "pulseaudio" "battery" "network" "clock" ];
      description = "Waybar modules shown on the right side. Defaults to Jurre's Niri desktop layout.";
    };

    temperature = {
      hwmonPath = lib.mkOption {
        type = lib.types.nullOr lib.types.str;
        default = "/sys/devices/platform/coretemp.0/hwmon";
        description = "Absolute hwmon path for Waybar temperature. Set to null to let Waybar auto-detect.";
      };

      inputFilename = lib.mkOption {
        type = lib.types.str;
        default = "temp1_input";
        description = "Temperature input filename inside hwmonPath.";
      };

      criticalThreshold = lib.mkOption {
        type = lib.types.int;
        default = 80;
        description = "Temperature critical threshold in degrees Celsius.";
      };

      interval = lib.mkOption {
        type = lib.types.int;
        default = 2;
        description = "Temperature polling interval in seconds.";
      };

      format = lib.mkOption {
        type = lib.types.str;
        default = "[c:{temperatureC}°]";
        description = "Waybar temperature format string.";
      };

      tooltip = lib.mkOption {
        type = lib.types.bool;
        default = false;
        description = "Whether the Waybar temperature module shows a tooltip.";
      };
    };
  };

  config = {
    programs.waybar = {
    enable = true; # Started explicitly by niri so it behaves like the old top bar.
    systemd.enable = false;
    package = pkgs.waybar;

    settings = {
      mainBar = {
        layer = "top";
        position = "bottom";
        height = theme.layout.bar.height;
        spacing = 0;
        # Center the bar at roughly 80% of the 1920px panel width.
        margin-left = theme.layout.bar.sideMargin;
        margin-right = theme.layout.bar.sideMargin;

        modules-left = [ "niri/workspaces" ];
        modules-center = [ ];
        modules-right = cfg.modulesRight;

        "niri/workspaces" = {
          format = "{value}";
          all-outputs = false;
          disable-click = false;
          current-only = false;
        };

        clock = {
          interval = 1;
          format = "[{:%Y-%m-%d W%V-%u %H:%M:%S}]";
          tooltip-format = "<tt><small>{calendar}</small></tt>";
          calendar = {
            mode = "year";
            mode-mon-col = 3;
            weeks-pos = "right";
            on-scroll = 1;
            format = {
              months = "<span color='${c.accent}'><b>{}</b></span>";
              days = "<span color='${c.text}'><b>{}</b></span>";
              weeks = "<span color='${c.accentSoft}'><b>W{}</b></span>";
              weekdays = "<span color='${c.warning}'><b>{}</b></span>";
              today = "<span color='${c.error}'><b><u>{}</u></b></span>";
            };
          };
        };


        cpu = {
          interval = 2;
          format = "[cpu:{usage}%]";
          tooltip-format = "CPU: {usage}%";
        };

        memory = {
          interval = 2;
          format = "[m:{used:0.1f}Gi/{total:0.0f}Gi]";
          tooltip-format = "RAM: {used:0.1f}Gi / {total:0.1f}Gi ({percentage}%)";
        };

        temperature = temperatureModule;

        backlight = {
          interval = 2;
          format = "[br:{percent}%]";
          tooltip = false;
        };

        battery = {
          interval = 10;
          states = {
            warning = 30;
            critical = 15;
          };
          format = "[b:{capacity}%]";
          format-discharging = "[b:{capacity}%dis]";
          format-charging = "[b:{capacity}%chg]";
          format-plugged = "[b:{capacity}%ac]";
          tooltip-format = "{capacity}% {timeTo}";
        };

        network = {
          interval = 2;
          format-wifi = "[w:{signaldBm}dBm]";
          format-ethernet = "[w:eth]";
          format-disconnected = "[w:dis]";
          tooltip-format-wifi = "{essid} ({signalStrength}%, {signaldBm}dBm)";
          tooltip-format-ethernet = "{ifname}: {ipaddr}";
          tooltip-format-disconnected = "Disconnected";
        };

        pulseaudio = {
          format = "[v:{volume}%]";
          format-bluetooth = "[v:{volume}%bt]";
          format-bluetooth-muted = "[v:mut]";
          format-muted = "[v:mut]";
          on-click = "wpctl set-mute @DEFAULT_AUDIO_SINK@ toggle";
          on-click-right = "pavucontrol";
          tooltip-format = "{desc}: {volume}%";
        };
      };
    };

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
        /* Keep workspace buttons inside the bar border so they don't paint over it. */
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
        font: ${toString f.sizes.serifUi}pt "${f.serif}";
        font-family: "${f.serif}";
        font-size: ${toString f.sizes.serifUi}pt;
        font-style: normal;
        font-weight: 400;
      }

      #workspaces button label {
        font: ${toString f.sizes.serifUi}pt "${f.serif}";
        font-family: "${f.serif}";
        font-size: ${toString f.sizes.serifUi}pt;
        font-style: normal;
        font-weight: 400;
      }

      #workspaces button.active,
      #workspaces button.visible {
        color: ${c.text};
        background: ${c.border};
      }

      #workspaces button.focused,
      #workspaces button.current,
      #workspaces button.active.focused,
      #workspaces button.active.current,
      #workspaces button.visible.focused,
      #workspaces button.visible.current {
        color: ${c.text};
        background: ${c.border};
      }

      #workspaces button.urgent {
        color: ${c.text};
        background: ${c.error};
      }

      #workspaces button:hover {
        background: ${c.border};
      }

      #clock,
      #clock label,
      #cpu,
      #cpu label,
      #memory,
      #memory label,
      #temperature,
      #temperature label,
      #backlight,
      #backlight label,
      #network,
      #network label,
      #pulseaudio,
      #pulseaudio label,
      #battery,
      #battery label {
        padding: 0 ${toString spacing.xxs}px;
        color: ${c.text};
        font: ${toString f.sizes.serifUi}pt "${f.serif}";
        font-family: "${f.serif}";
        font-size: ${toString f.sizes.serifUi}pt;
        font-style: normal;
        font-weight: 400;
      }

      #clock,
      #cpu,
      #memory,
      #temperature,
      #backlight,
      #network,
      #pulseaudio,
      #battery {
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
      
      @keyframes blink {
        0% {
          opacity: 1;
        }
        49% {
          opacity: 1;
        }
        50% {
          opacity: 0.5;
        }
        100% {
          opacity: 0.5;
        }
      }
    '';
    };
  };
}
