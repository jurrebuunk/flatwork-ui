{ pkgs, ... }:

{
  nixpkgs.overlays = [ (import ../overlays/default.nix) ];

  fonts.packages = with pkgs; [
    nerd-fonts.caskaydia-mono
    nerd-fonts.martian-mono
    ibm-plex
    ibm-plex-mono-nerd
    stix-two
    noto-fonts
    noto-fonts-color-emoji
  ];
}
