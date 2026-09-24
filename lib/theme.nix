{ lib }:

let
  removeHash = hex: lib.removePrefix "#" hex;
  themeToCssVars = theme: ''
    :root {
      --flatwork-background: ${theme.colors.background};
      --flatwork-surface: ${theme.colors.surface};
      --flatwork-surface-alt: ${theme.colors.surfaceAlt};
      --flatwork-text: ${theme.colors.text};
      --flatwork-text-muted: ${theme.colors.textMuted};
      --flatwork-text-faint: ${theme.colors.textFaint};
      --flatwork-border: ${theme.colors.border};
      --flatwork-border-strong: ${theme.colors.borderStrong};
      --flatwork-accent: ${theme.colors.accent};
      --flatwork-accent-bright: ${theme.colors.accentBright};
      --flatwork-accent-soft: ${theme.colors.accentSoft};
      --flatwork-highlight: ${theme.colors.highlight};
      --flatwork-error: ${theme.colors.error};
      --flatwork-success: ${theme.colors.success};
      --flatwork-warning: ${theme.colors.warning};
      --flatwork-secondary: ${theme.colors.secondary};
      --flatwork-radius: ${theme.geometry.radiusPx};
      --flatwork-border-width: ${theme.geometry.border.widthPx};
      --flatwork-font-serif: "${theme.fonts.serif}";
      --flatwork-font-mono: "${theme.fonts.mono}";
    }
  '';
  themeToJson = theme: builtins.toJSON {
    name = theme.name or "flatwork";
    wallpaper = toString theme.wallpaper;
    inherit (theme) colors fonts geometry layout animation icons cursor gtk display;
  };
in
{
  inherit themeToCssVars themeToJson removeHash;
}
