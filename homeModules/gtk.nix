{ config, pkgs, theme ? import ../themes/default.nix, ... }:

let
  c = theme.colors;
  f = theme.fonts;
  g = theme.geometry;
  cursor = theme.cursor;
  icons = theme.icons;
  iconPackage = builtins.getAttr icons.package pkgs;
  cursorPackage =
    if builtins.hasAttr cursor.package pkgs
    then builtins.getAttr cursor.package pkgs
    else pkgs.mcMojaveCursors;

  gtkCss = ''
    @define-color bg             ${c.background};
    @define-color surface        ${c.surface};
    @define-color surface_alt    ${c.surfaceAlt};
    @define-color fg             ${c.text};
    @define-color muted          ${c.textMuted};
    @define-color faint          ${c.textFaint};
    @define-color red            ${c.error};
    @define-color green          ${c.success};
    @define-color yellow         ${c.warning};
    @define-color blue           ${c.accent};
    @define-color accent_bright  ${c.accentBright};
    @define-color purple         ${c.secondary};
    @define-color cyan           ${c.accentSoft};
    @define-color orange         ${c.warning};
    @define-color gray           ${c.border};
    @define-color border_strong  ${c.borderStrong};

    /* 
     * OVERRIDE STANDARD GTK/LIBADWAITA VARIABLES
     * This changes the "standard dark mode color" system-wide by redefining the variables
     * that apps use, rather than forcing a background on all elements.
     */

    /* GTK3/4 Base Colors */
    @define-color theme_bg_color @bg;
    @define-color theme_fg_color @fg;
    @define-color theme_base_color @bg;
    @define-color theme_text_color @fg;
    @define-color theme_selected_bg_color @blue;
    @define-color theme_selected_fg_color @bg;
    @define-color theme_view_bg_color @bg;
    @define-color theme_view_fg_color @fg;

    /* Libadwaita / GTK4 Modern Variables */
    @define-color window_bg_color @bg;
    @define-color window_fg_color @fg;
    @define-color view_bg_color @bg;
    @define-color view_fg_color @fg;
    @define-color headerbar_bg_color @bg;
    @define-color headerbar_fg_color @fg;
    @define-color card_bg_color @bg;
    @define-color popover_bg_color @bg;
    @define-color dialog_bg_color @bg;

    /* Internal Palette Overrides */
    @define-color dark_1 @bg;
    @define-color dark_2 @bg;
    @define-color dark_3 @bg;
    @define-color dark_4 @bg;
    @define-color dark_5 @bg;

    /* Semantic interaction tokens */
    @define-color accent_color @blue;
    @define-color accent_bg_color @blue;
    @define-color accent_fg_color @bg;
    @define-color destructive_color @red;
    @define-color destructive_bg_color @red;
    @define-color destructive_fg_color @bg;
    @define-color success_color @green;
    @define-color warning_color @yellow;
    @define-color error_color @red;

    /* 
     * EXPLICIT STYLING
     * Ensures all containers use the theme background and interactive elements keep 1px borders.
     */

    window, 
    .background, 
    .view, 
    viewport, 
    iconview, 
    treeview, 
    list, 
    tray, 
    .main-window,
    toolbar,
    .toolbar,
    headerbar,
    .titlebar,
    menubar,
    .menubar,
    .dialog,
    .popover,
    .menu,
    .context-menu,
    messagedialog,
    popover,
    decoration {
      background-color: @bg;
      background-image: none;
      color: @fg;
      border-radius: ${g.radiusPx};
      box-shadow: ${g.boxShadow};
    }

    /* Additional override for decoration nodes (shadows/rounding) */
    decoration, decoration:backdrop {
      border-radius: ${g.radiusPx};
      box-shadow: ${g.boxShadow};
      margin: 0;
    }

    /* Hide window buttons (close, min, max) */
    headerbar windowcontrols,
    .titlebar windowcontrols {
      display: none;
    }

    /* 1px structural borders for specific interactive elements and dialogs */
    button,
    entry,
    spinbutton,
    combobox,
    textview,
    textview text,
    searchbar,
    .linked > entry,
    .linked > button,
    .dialog,
    messagedialog,
    popover > contents {
      border: ${g.border.widthPx} solid @gray;
      border-radius: ${g.radiusPx};
    }

    /* Remove borders from views and containers that shouldn't have them */
    window, 
    .background, 
    .view, 
    viewport, 
    iconview, 
    treeview, 
    list, 
    tray, 
    headerbar,
    .titlebar,
    .card,
    scrollbar,
    scrollbar slider,
    progressbar,
    levelbar {
      border: none;
      border-radius: ${g.radiusPx};
    }

    button,
    entry,
    spinbutton,
    combobox,
    textview,
    textview text,
    searchentry {
      background-color: @bg;
      background-image: none;
      color: @fg;
      box-shadow: ${g.boxShadow};
      border-radius: ${g.radiusPx};
    }

    button:hover,
    menubar > menuitem:hover,
    menuitem:hover,
    modelbutton:hover,
    row:hover {
      background-color: @surface;
      color: @fg;
    }

    button:active,
    button:checked,
    button.toggle:checked,
    modelbutton:active,
    row:active {
      background-color: @surface_alt;
      border-color: @blue;
      color: @fg;
    }

    button.suggested-action,
    button.suggested-action:hover,
    button.suggested-action:active {
      background-color: @blue;
      border-color: @blue;
      color: @bg;
    }

    button.destructive-action,
    button.destructive-action:hover,
    button.destructive-action:active {
      background-color: @red;
      border-color: @red;
      color: @bg;
    }

    button:disabled,
    entry:disabled,
    spinbutton:disabled,
    combobox:disabled,
    row:disabled {
      color: @faint;
      border-color: @gray;
      opacity: 0.55;
    }

    entry:hover,
    spinbutton:hover,
    combobox:hover,
    textview:hover,
    searchentry:hover {
      border-color: @border_strong;
    }

    entry:focus,
    entry:focus-within,
    spinbutton:focus,
    combobox:focus,
    textview:focus,
    textview:focus-within,
    searchentry:focus,
    button:focus {
      border-color: @accent_bright;
      outline: ${g.focusOutline.widthPx} solid @accent_bright;
      outline-offset: -${g.border.widthPx};
    }

    /* Selection fixes */
    .view:selected,
    .view:selected:focus,
    treeview.view:selected,
    treeview.view:selected:focus,
    row:selected {
      background-color: @theme_selected_bg_color;
      color: @theme_selected_fg_color;
      border: none;
    }

    /* Tabs: keep the app surface unified; show state with text/border only. */
    notebook,
    notebook > header,
    notebook > header > tabs,
    notebook > header tab,
    tabbar,
    tabbox,
    tabbox tab,
    tab {
      background-color: @bg;
      background-image: none;
      border-radius: ${g.radiusPx};
      box-shadow: ${g.boxShadow};
    }

    notebook > header tab,
    tabbox tab,
    tab {
      color: @muted;
      border: none;
      border-bottom: ${g.border.widthPx} solid transparent;
    }

    notebook > header tab:hover,
    tabbox tab:hover,
    tab:hover {
      color: @fg;
      border-bottom-color: @border_strong;
    }

    notebook > header tab:checked,
    notebook > header tab:selected,
    tabbox tab:checked,
    tab:selected {
      color: @fg;
      border-bottom-color: @blue;
    }

    /* Menus/popovers get a subtle gray surface so they don't disappear into the app bg. */
    popover > contents,
    menu,
    .menu,
    .context-menu {
      background-color: @surface;
      border: ${g.border.widthPx} solid @gray;
      border-radius: ${g.radiusPx};
      box-shadow: ${g.boxShadow};
    }

    popover menuitem,
    popover modelbutton,
    menu menuitem,
    .menu menuitem,
    .context-menu menuitem {
      background-color: transparent;
      color: @fg;
    }

    popover menuitem:hover,
    popover modelbutton:hover,
    menu menuitem:hover,
    .menu menuitem:hover,
    .context-menu menuitem:hover,
    popover menuitem:selected,
    popover modelbutton:selected,
    menu menuitem:selected,
    .menu menuitem:selected,
    .context-menu menuitem:selected {
      background-color: @blue;
      color: @bg;
    }

    separator,
    .separator {
      background-color: @gray;
      min-height: ${g.border.widthPx};
      min-width: ${g.border.widthPx};
    }

    label:disabled,
    .dim-label,
    .subtitle,
    .caption {
      color: @muted;
      font-style: italic;
    }

    /* Choice controls and progress use the theme tokens without changing the page bg. */
    check,
    radio,
    checkbutton check,
    radiobutton radio {
      background-color: @bg;
      border: ${g.border.widthPx} solid @gray;
      border-radius: ${g.radiusPx};
      color: @bg;
      box-shadow: ${g.boxShadow};
    }

    check:hover,
    radio:hover,
    checkbutton check:hover,
    radiobutton radio:hover {
      border-color: @border_strong;
      background-color: @surface;
    }

    check:checked,
    radio:checked,
    checkbutton check:checked,
    radiobutton radio:checked {
      background-color: @blue;
      border-color: @blue;
      color: @bg;
    }

    switch,
    switch slider,
    scale trough,
    scale slider,
    progressbar trough,
    progressbar progress,
    levelbar trough,
    levelbar block {
      border-radius: ${g.radiusPx};
      box-shadow: ${g.boxShadow};
    }

    switch,
    scale trough,
    progressbar trough,
    levelbar trough {
      background-color: @surface;
      border: ${g.border.widthPx} solid @gray;
    }

    switch:checked,
    scale highlight,
    progressbar progress,
    levelbar block.filled {
      background-color: @blue;
      border-color: @blue;
    }

    scale slider,
    switch slider {
      background-color: @fg;
      border: ${g.border.widthPx} solid @border_strong;
    }

    /* Scrollbars */
    scrollbar {
      background-color: @bg;
    }

    scrollbar slider {
      background-color: @gray;
      border-radius: ${g.radiusPx};
      min-width: 6px;
      min-height: 6px;
    }

    scrollbar slider:hover {
      background-color: @border_strong;
    }

    tooltip {
      background-color: @bg;
      color: @fg;
      border: ${g.border.widthPx} solid @gray;
      border-radius: ${g.radiusPx};
      box-shadow: ${g.boxShadow};
    }
  '';

  mcMojaveCursors = pkgs.stdenvNoCC.mkDerivation {
    pname = "mcmojave-cursors";
    version = "2024-03-17";

    src = pkgs.fetchFromGitHub {
      owner = "vinceliuice";
      repo = "McMojave-cursors";
      rev = "7d0bfc1f91028191cdc220b87fd335a235ee4439";
      hash = "sha256-4YqSucpxA7jsuJ9aADjJfKRPgPR89oq2l0T1N28+GV0=";
    };

    dontBuild = true;

    installPhase = ''
      runHook preInstall
      mkdir -p $out/share/icons
      cp -r dist $out/share/icons/McMojave-cursors
      runHook postInstall
    '';
  };

in {
  xdg.desktopEntries.code = {
    name = "Visual Studio Code";
    exec = "/run/current-system/sw/bin/code %F";
    terminal = false;
    type = "Application";
    categories = [ "Development" "IDE" "TextEditor" ];
  };

  xdg.desktopEntries.chromium = {
    name = "Chromium";
    exec = "/run/current-system/sw/bin/chromium %U";
    terminal = false;
    type = "Application";
    categories = [ "Network" "WebBrowser" ];
    mimeType = [ "text/html" "x-scheme-handler/http" "x-scheme-handler/https" ];
  };

  xdg.desktopEntries."chromium-browser" = {
    name = "Chromium Browser";
    exec = "/run/current-system/sw/bin/chromium %U";
    terminal = false;
    type = "Application";
    categories = [ "Network" "WebBrowser" ];
    mimeType = [ "text/html" "x-scheme-handler/http" "x-scheme-handler/https" ];
  };

  xdg.configFile."gtk-3.0/gtk.css" = {
    text = gtkCss;
    force = true;
  };

  xdg.configFile."gtk-4.0/gtk.css" = {
    text = gtkCss;
    force = true;
  };

  home.packages = [
    pkgs.nerd-fonts.fira-code
    iconPackage
    cursorPackage
  ];

  home.sessionVariables = {
    XCURSOR_SIZE = toString cursor.size;
    XCURSOR_THEME = cursor.name;
  };

  gtk = {
    enable = true;
    iconTheme = {
      name = icons.name;
      package = iconPackage;
    };
    cursorTheme = {
      name = cursor.name;
      package = cursorPackage;
      size = cursor.size;
    };
    font = {
      name = f.serif;
      package = pkgs.stix-two;
      size = f.sizes.serifUi;
    };
    gtk3.extraConfig = {
      gtk-application-prefer-dark-theme = 1;
      gtk-cursor-theme-name = cursor.name;
      gtk-cursor-theme-size = cursor.size;
    };
    gtk4.extraConfig = {
      gtk-application-prefer-dark-theme = 1;
      gtk-cursor-theme-name = cursor.name;
      gtk-cursor-theme-size = cursor.size;
    };
  };
}
