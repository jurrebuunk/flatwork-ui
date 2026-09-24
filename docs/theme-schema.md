# Theme schema

A Flatwork UI theme is a Nix attrset consumed by the Home Manager modules.

Required top-level fields:

```nix
{
  name = "theme-name";
  wallpaper = ./wallpapers/example.jpg;
  colors = { ... };
  fonts = { ... };
  geometry = { ... };
  display = { scale = 1.0; };
  layout = { ... };
  animation = { ... };
  icons = { name = "..."; package = "..."; };
  cursor = { name = "..."; package = "..."; size = 12; };
  gtk = { preferDark = true; ... };
}
```

## Colors

Required colors:

```nix
colors = {
  background surface surfaceAlt
  text textMuted textFaint
  border borderStrong
  accent accentBright accentSoft highlight
  error success warning secondary
  states = { default hover active focus disabled error success warning; };
  terminal = {
    black red green yellow blue magenta cyan white
    brightBlack brightRed brightGreen brightYellow brightBlue brightMagenta brightCyan brightWhite
    foreground background cursor
  };
};
```

## Fonts

Required font keys:

```nix
fonts = {
  serif = "STIX Two Text";
  serifItalic = "STIX Two Text Italic";
  mono = "IBM Plex Mono Text";
  monoItalic = "IBM Plex Mono Italic";
  sizes = { ui serifUi label document; };
  roles = { display heading subheading body supporting label caption technicalMetadata terminal code; };
};
```

## Geometry/layout

Required geometry/layout keys:

```nix
geometry = {
  radius = 0;
  radiusPx = "0px";
  border = { width = 1; widthPx = "1px"; emphasisWidth = 2; emphasisWidthPx = "2px"; };
  focusOutline = { width = 2; widthPx = "2px"; color = "#..."; };
  shadow = "none";
  boxShadow = "none";
};

layout = {
  spacing = { none xxs xs sm md lg xl xxl xxxl; };
  bar = { height sideMargin; };
  panel = { gap padding width; };
  notification = { width padding margin; };
};
```
