{ config, pkgs, lib, theme ? import ../themes/default.nix, ... }:

let
  c = theme.colors;
  f = theme.fonts;
  g = theme.geometry;
in {
  wayland.windowManager.sway.extraConfig = ''
    # Border settings
    default_border pixel ${toString g.border.width}
    default_floating_border pixel ${toString g.border.width}

    # Force borders for Libadwaita/CSD apps and dialogs
    for_window [app_id=".*"] border pixel ${toString g.border.width}
    for_window [window_role=".*"] border pixel ${toString g.border.width}
    for_window [window_type="dialog"] border pixel ${toString g.border.width}
    for_window [window_type="utility"] border pixel ${toString g.border.width}
    for_window [window_type="toolbar"] border pixel ${toString g.border.width}
    for_window [window_type="splash"] border pixel ${toString g.border.width}
    for_window [window_type="menu"] border pixel ${toString g.border.width}
    for_window [window_type="dropdown_menu"] border pixel ${toString g.border.width}
    for_window [window_type="popup_menu"] border pixel ${toString g.border.width}
    for_window [window_type="tooltip"] border pixel ${toString g.border.width}

    exec_always swaybg -i ${theme.wallpaper} -m fill

    # Font from theme
    font pango:${f.mono} ${toString f.sizes.ui}

    # Gruvbox colors from theme
    client.focused          ${c.accent} ${c.accent} ${c.text} ${c.accent} ${c.accent}
    client.focused_inactive ${c.border} ${c.border} ${c.text} ${c.border} ${c.border}
    client.unfocused        ${c.border} ${c.border} ${c.border} ${c.border} ${c.border}
    client.urgent           ${c.error} ${c.error} ${c.text} ${c.error} ${c.error}
    client.placeholder      ${c.background} ${c.background} ${c.text} ${c.background} ${c.background}

    # Swaybar disabled; Waybar is used for desktop status.

    # Gestures
    bindgesture swipe:left workspace next
    bindgesture swipe:right workspace prev

    bindgesture pinch:inward+up move up
    bindgesture pinch:inward+down move down
    bindgesture pinch:inward+left move left
    bindgesture pinch:inward+right move right

  '';
}
