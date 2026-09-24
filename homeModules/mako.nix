{ theme ? import ../themes/default.nix, ... }:

let
  c = theme.colors;
  f = theme.fonts;
  g = theme.geometry;
  s = theme.layout.spacing;
in
{
  services.mako = {
    enable = true;

    settings = {
      default-timeout = 10000;
      background-color = c.background;
      text-color = c.text;
      border-color = c.border;
      progress-color = c.success;

      border-size = g.border.width;
      padding = s.lg;
      margin = s.xl;
      font = "${f.mono} ${toString f.sizes.ui}";
      anchor = "top-right";
      max-visible = 5;
      layer = "overlay";
    };

    extraConfig = ''
      [urgency=high]
      border-color=${c.error}
      default-timeout=0

      [category=status-update]
      anchor=top-center
      margin=${toString s.xl},0,0,0
      padding=${toString s.xs}
      width=300
      text-alignment=center
      group-by=category
      format=%s
      default-timeout=3000
      border-color=${c.border}
      progress-color=${c.border}
    '';
  };
}
