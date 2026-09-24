{ config, lib, theme ? import ../themes/default.nix, ... }:

let
  hexToRgb = hex:
    let
      clean = builtins.substring 1 6 hex;
      component = offset:
        toString (builtins.fromTOML "x = 0x${builtins.substring offset 2 clean}").x;
    in
    {
      r = component 0;
      g = component 2;
      b = component 4;
    };
  promptColor = hexToRgb theme.colors.accent;
in
{
  options.flatwork.bashPrompt.enable = lib.mkOption {
    type = lib.types.bool;
    default = true;
    description = "Enable Bash prompt styling.";
  };

  config = lib.mkIf config.flatwork.bashPrompt.enable {
      programs.bash.initExtra = ''
        PS1='\[\e[1;38;2;${promptColor.r};${promptColor.g};${promptColor.b}m\]\w\[\e[0m\] $ '
      '';
  };
}
