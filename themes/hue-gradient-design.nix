# Hue Gradient theme with expanded design-system tokens from DESIGN.MD.
{
  name = "hue-gradient-design";
  wallpaper = ./wallpapers/starship.jpg;

  colors = {
    background = "#1b1818";
    surface = "#252121";
    surfaceAlt = "#302b2b";

    text = "#c4c1c1";
    textMuted = "#918c8c";
    textFaint = "#777272";

    border = "#666262";
    borderStrong = "#7b7676";

    accent = "#8aa1a8";
    accentBright = "#a5bbc2";
    accentSoft = "#9fc7c4";
    highlight = "#d7ffc3";

    error = "#c97070";
    success = "#8fae9a";
    warning = "#c2a27d";
    secondary = "#9b8fa3";

    states = {
      default = "#252121";
      hover = "#302b2b";
      active = "#8aa1a8";
      focus = "#a5bbc2";
      disabled = "#777272";
      error = "#c97070";
      success = "#8fae9a";
      warning = "#c2a27d";
    };

    terminal = {
      black = "#1b1818";
      red = "#c97070";
      green = "#8fae9a";
      yellow = "#c2a27d";
      blue = "#8aa1a8";
      magenta = "#9b8fa3";
      cyan = "#9fc7c4";
      white = "#c4c1c1";

      brightBlack = "#777272";
      brightRed = "#df8a8a";
      brightGreen = "#a9c9b4";
      brightYellow = "#d8bb96";
      brightBlue = "#a5bbc2";
      brightMagenta = "#b7aabd";
      brightCyan = "#badeda";
      brightWhite = "#e5e2e2";

      foreground = "#c4c1c1";
      background = "#1b1818";
      cursor = "#a5bbc2";
    };
  };

  fonts = {
    serif = "STIX Two Text";
    serifItalic = "STIX Two Text Italic";
    # Use IBM Plex Mono Text as the default mono face: a touch sturdier than Regular
    # without jumping all the way to Medium/Bold.
    mono = "IBM Plex Mono Text";
    monoItalic = "IBM Plex Mono Italic";

    # Practical application sizes chosen to preserve the pre-tokenization UI scale.
    sizes = {
      ui = 11;
      # STIX Two Text reads slightly smaller than the mono face, so give serif UI
      # surfaces a small compensation while keeping mono terminal/chrome compact.
      serifUi = 12;
      label = 13;
      document = 12;
    };

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
    radius = 0;
    radiusPx = "0px";

    border = {
      width = 1;
      widthPx = "1px";
      emphasisWidth = 2;
      emphasisWidthPx = "2px";
    };

    focusOutline = {
      width = 2;
      widthPx = "2px";
      color = "#a5bbc2";
    };

    shadow = "none";
    boxShadow = "none";
  };

  display = {
    scale = 1.0;
  };

  layout = {
    # Practical compact scale for configs. DESIGN.MD names compact, precise,
    # restrained spacing but does not prescribe exact numeric values.
    spacing = {
      none = 0;
      xxs = 2;
      xs = 4;
      sm = 6;
      md = 8;
      lg = 12;
      xl = 16;
      xxl = 24;
      xxxl = 32;
    };

    bar = {
      height = 24;
      # On the 1920px laptop panel this leaves an 80% wide bar centered
      # between 10% side margins.
      sideMargin = 192;
    };

    panel = {
      gap = 4;
      padding = 4;
      width = 380;
    };

    notification = {
      width = 380;
      padding = 12;
      margin = 4;
    };
  };

  animation = {
    subtle = true;
    durationFastMs = 120;
    durationNormalMs = 220;
    easing = "ease-out";
  };

  icons = {
    name = "Qogir-Dark";
    package = "qogir-icon-theme";
  };

  cursor = {
    name = "McMojave-cursors";
    package = "mcMojaveCursors";
    size = 12;
  };

  gtk = {
    preferDark = true;
    iconTheme = "Qogir-Dark";
    cursorTheme = "McMojave-cursors";
    cursorSize = 12;
  };
}
