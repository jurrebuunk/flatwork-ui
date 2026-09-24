{ config, pkgs, theme ? import ../themes/default.nix, ... }:

let
  c = theme.colors;
  logoPath = "${config.xdg.configHome}/fastfetch/nixos-medium.txt";
in
{
  home.packages = [ pkgs.fastfetch ];

  xdg.configFile."fastfetch/nixos-medium.txt".text = ''
$1     __   $2__    __
$1     \ \  $2\ \  / /
$1   ___\ \__$2\ \/ /
$1  /_________$2\  / $1/\
$2 ____/ /     $2\ \$1/ /
$2/___  /       $2\$1/ /___
$2   / /$1\       / ____/
$2  / /$1\ \$2_____$1/$2_$1/$2___
$2  \/ $1/\ \$2____  ___/
$1    $1/ /\ \   $2\ \
$1   $1/_/  \_\   $2\_\
  '';

  xdg.configFile."fastfetch/config.jsonc".text = builtins.toJSON {
    "$schema" = "https://github.com/fastfetch-cli/fastfetch/raw/master/doc/json_schema.json";
    logo = {
      type = "auto";
      source = logoPath;
      color = {
        "1" = c.accent;
        "2" = c.accentBright;
      };
      padding = {
        top = 0;
        left = 1;
      };
    };
    display = {
      separator = ":";
      color = {
        keys = c.textMuted;
        output = c.text;
        title = c.text;
      };
    };
    modules = [
      "break"
      { type = "os"; key = "[os"; format = "{name} {version-id}]"; outputColor = c.text; }
      { type = "host"; key = "[host"; format = "{name}]"; outputColor = c.text; }
      { type = "kernel"; key = "[kernel"; format = "{release}]"; outputColor = c.text; }
      { type = "wm"; key = "[wm"; format = "{pretty-name} {version}]"; outputColor = c.text; }
      { type = "cpu"; key = "[cpu"; format = "{name}]"; outputColor = c.text; }
      { type = "memory"; key = "[mem"; format = "{used}/{total} ({percentage})]"; outputColor = c.text; }
      { type = "disk"; key = "[disk"; folders = "/"; format = "{size-used}/{size-total} ({size-percentage})]"; outputColor = c.text; }
      { type = "localip"; key = "[ip"; showPrefixLen = false; format = "{ipv4}]"; outputColor = c.text; }
      { type = "colors"; symbol = "block"; paddingLeft = 0; block = { width = 2; }; }
    ];
  };
}
