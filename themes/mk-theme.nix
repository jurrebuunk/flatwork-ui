{ name
, wallpaper
, background
, surface ? background
, surfaceAlt ? surface
, text
, textMuted ? border
, textFaint ? border
, border
, borderStrong ? border
, accent
, accentBright ? accent
, accentSoft ? accent
, highlight ? accentBright
, error
, success
, warning
, secondary
, terminal ? null
}:

let
  terminalColors = if terminal != null then terminal else {
    black = background;
    red = error;
    green = success;
    yellow = warning;
    blue = accent;
    magenta = secondary;
    cyan = accentSoft;
    white = text;
    brightBlack = textFaint;
    brightRed = error;
    brightGreen = success;
    brightYellow = highlight;
    brightBlue = accentBright;
    brightMagenta = secondary;
    brightCyan = accentSoft;
    brightWhite = "#ffffff";
    foreground = text;
    background = background;
    cursor = accentBright;
  };
in
{
  inherit name wallpaper;
  colors = {
    inherit background surface surfaceAlt text textMuted textFaint border borderStrong accent accentBright accentSoft highlight error success warning secondary;
    states = {
      default = surface;
      hover = surfaceAlt;
      active = accent;
      focus = accentBright;
      disabled = textFaint;
      inherit error success warning;
    };
    terminal = terminalColors;
  };
  fonts = {
    serif = "STIX Two Text";
    serifItalic = "STIX Two Text Italic";
    mono = "IBM Plex Mono Text";
    monoItalic = "IBM Plex Mono Italic";
    sizes = { ui = 11; serifUi = 12; label = 13; document = 12; };
    roles = {
      display = { family = "STIX Two Text"; sizePx = 27; weight = "regular"; style = "normal"; };
      heading = { family = "STIX Two Text"; sizePx = 20; weight = "regular"; style = "normal"; };
      subheading = { family = "STIX Two Text"; sizePx = 18; weight = "regular"; style = "italic"; };
      body = { family = "STIX Two Text"; sizePx = 17; weight = "regular"; style = "normal"; };
      supporting = { family = "STIX Two Text"; sizePx = 15; weight = "regular"; style = "italic"; };
      label = { family = "STIX Two Text"; sizePx = 15; weight = "regular"; style = "normal"; };
      caption = { family = "STIX Two Text"; sizePx = 14; weight = "regular"; style = "italic"; };
      technicalMetadata = { family = "IBM Plex Mono"; sizePx = 14; weight = "regular"; style = "normal"; };
      terminal = { family = "IBM Plex Mono"; sizePx = 16; weight = "regular"; style = "normal"; };
      code = { family = "IBM Plex Mono"; weight = "regular"; style = "normal"; };
    };
  };
  geometry = {
    radius = 0; radiusPx = "0px";
    border = { width = 1; widthPx = "1px"; emphasisWidth = 2; emphasisWidthPx = "2px"; };
    focusOutline = { width = 2; widthPx = "2px"; color = accentBright; };
    shadow = "none"; boxShadow = "none";
  };
  display.scale = 1.0;
  layout = {
    spacing = { none = 0; xxs = 2; xs = 4; sm = 6; md = 8; lg = 12; xl = 16; xxl = 24; xxxl = 32; };
    bar = { height = 24; sideMargin = 192; };
    panel = { gap = 4; padding = 4; width = 380; };
    notification = { width = 380; padding = 12; margin = 4; };
  };
  animation = { subtle = true; durationFastMs = 120; durationNormalMs = 220; easing = "ease-out"; };
  icons = { name = "Qogir-Dark"; package = "qogir-icon-theme"; };
  cursor = { name = "McMojave-cursors"; package = "mcMojaveCursors"; size = 12; };
  gtk = { preferDark = true; iconTheme = "Qogir-Dark"; cursorTheme = "McMojave-cursors"; cursorSize = 12; };
}
