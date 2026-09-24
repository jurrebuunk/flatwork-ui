import ./mk-theme.nix {
  name = "starship";
  wallpaper = ./wallpapers/starship-stage-sep.jpg;
  background = "#010409"; surface = "#0d1117"; surfaceAlt = "#161b22";
  text = "#e6edf3"; textMuted = "#b1bac4"; textFaint = "#6e7681";
  border = "#484f58"; borderStrong = "#6e7681";
  accent = "#58a6ff"; accentBright = "#79c0ff"; accentSoft = "#39c5cf"; highlight = "#d29922";
  error = "#ff7b72"; success = "#3fb950"; warning = "#d29922"; secondary = "#bc8cff";
}
