{ config, pkgs, lib, theme ? import ../themes/default.nix, ... }:

let
  c = theme.colors;
  g = theme.geometry;
  spacing = theme.layout.spacing;
in
{
  options.flatwork.firefox.enable = lib.mkOption {
    type = lib.types.bool;
    default = true;
    description = "Enable Firefox full UI experience.";
  };

  config = lib.mkIf config.flatwork.firefox.enable {
      programs.firefox = {
        enable = true;
        policies = {
          ExtensionSettings = {
            "uBlock0@raymondhill.net" = {
              install_url = "https://addons.mozilla.org/firefox/downloads/latest/ublock-origin/latest.xpi";
              installation_mode = "force_installed";
            };
          };
        };


        profiles.default = {
          name = "default";

        # Colour roles follow DESIGN.md:
        #   chrome + page canvas  -> background
        #   fields, menus, popups -> surface, 1px border
        #   hover                 -> states.hover (surface change)
        #   active / selection    -> states.active (accent), text on background
        #   keyboard focus        -> states.focus
        userChrome = ''
          /* === TOKENS === */
          :root {
            --fw-bg: ${c.background};
            --fw-surface: ${c.surface};
            --fw-hover: ${c.states.hover};
            --fw-active: ${c.states.active};
            --fw-focus: ${c.states.focus};
            --fw-text: ${c.text};
            --fw-text-muted: ${c.textMuted};
            --fw-border: ${c.border};
            --fw-border-width: ${g.border.widthPx};
            --fw-radius: ${g.radiusPx};

            /* Firefox chrome variables mapped onto Flatwork tokens */
            --toolbar-bgcolor: var(--fw-bg) !important;
            --toolbar-color: var(--fw-text) !important;
            --toolbox-bgcolor: var(--fw-bg) !important;
            --toolbox-bgcolor-inactive: var(--fw-bg) !important;
            --toolbox-textcolor: var(--fw-text) !important;
            --toolbox-non-lwt-bgcolor: var(--fw-bg) !important;
            --toolbox-non-lwt-bgcolor-inactive: var(--fw-bg) !important;
            --lwt-accent-color: var(--fw-bg) !important;
            --lwt-accent-color-inactive: var(--fw-bg) !important;
            /* No separator line between the top bar and the page */
            --chrome-content-separator-color: transparent !important;
            /* Match the URL bar height to the toolbar buttons */
            --urlbar-height: ${toString spacing.xxxl}px !important;
            --content-area-shadow: none !important;

            --toolbar-field-background-color: var(--fw-surface) !important;
            --toolbar-field-background-color-focus: var(--fw-surface) !important;
            --toolbar-field-color: var(--fw-text) !important;
            --toolbar-field-focus-color: var(--fw-text) !important;
            --toolbar-field-border-color: var(--fw-border) !important;
            --toolbar-field-border-color-focus: var(--fw-focus) !important;
            --focus-outline-color: var(--fw-focus) !important;
            --link-color: ${c.accent} !important;

            --toolbarbutton-border-radius: var(--fw-radius) !important;
            --toolbarbutton-hover-background: var(--fw-hover) !important;
            --toolbarbutton-active-background: var(--fw-hover) !important;
            --tab-border-radius: var(--fw-radius) !important;
            --urlbar-border-radius: var(--fw-radius) !important;
            --border-radius-small: var(--fw-radius) !important;
            --border-radius-medium: var(--fw-radius) !important;
            --border-radius-large: var(--fw-radius) !important;
            --arrowpanel-border-radius: var(--fw-radius) !important;
            --panel-border-radius: var(--fw-radius) !important;

            --arrowpanel-background: var(--fw-surface) !important;
            --arrowpanel-color: var(--fw-text) !important;
            --arrowpanel-border-color: var(--fw-border) !important;
            --arrowpanel-dimmed: var(--fw-hover) !important;
            --arrowpanel-dimmed-further: var(--fw-hover) !important;
          }

          /* === CHROME + CONTENT AREA === */
          #navigator-toolbox,
          #TabsToolbar,
          #nav-bar,
          #PersonalToolbar,
          #browser,
          #tabbrowser-tabbox,
          #tabbrowser-tabpanels {
            background-color: var(--fw-bg) !important;
            color: var(--fw-text) !important;
          }

          #navigator-toolbox,
          #nav-bar,
          #PersonalToolbar {
            border-bottom: none !important;
            box-shadow: none !important;
          }

          /* Flat, square page area: no card, shadow or gap */
          #tabbrowser-tabbox,
          #tabbrowser-tabpanels,
          .browserContainer,
          .browserStack,
          .browserStack > browser {
            border-radius: 0 !important;
            outline: none !important;
            box-shadow: none !important;
            margin: 0 !important;
          }

          /* === SIDEBAR (removed entirely) === */
          #sidebar-container,
          #sidebar-main,
          #sidebar-launcher-splitter,
          #sidebar-box,
          #sidebar-splitter,
          #sidebar-button {
            display: none !important;
          }

          /* === TABS === */
          .tabbrowser-tab {
            --tab-close-button-border-color: transparent !important;
            --tab-close-button-border-color-hover: transparent !important;
            --tab-close-button-border-color-active: transparent !important;
          }

          .tab-background {
            background-color: var(--fw-bg) !important;
            border: var(--fw-border-width) solid var(--fw-border) !important;
            border-radius: var(--fw-radius) !important;
            outline: none !important;
            box-shadow: none !important;
            clip-path: none !important;
          }

          .tab-background::before,
          .tab-background::after {
            display: none !important;
          }

          .tabbrowser-tab:hover > .tab-stack > .tab-background:not([selected]) {
            background-color: var(--fw-hover) !important;
          }

          .tab-background[selected] {
            background-color: var(--fw-active) !important;
            border-color: var(--fw-active) !important;
          }

          .tabbrowser-tab[selected] .tab-label,
          .tabbrowser-tab[selected] .tab-close-button {
            color: var(--fw-bg) !important;
          }

          .tab-close-button {
            border: none !important;
            outline: none !important;
            box-shadow: none !important;
            border-radius: var(--fw-radius) !important;
            background-color: transparent !important;
          }

          .tab-close-button:hover {
            background-color: var(--fw-hover) !important;
            color: var(--fw-text) !important;
          }

          /* === TOOLBAR BUTTONS (Back, Forward, Reload, etc.) === */
          #nav-bar .toolbarbutton-1 {
            width: ${toString spacing.xxxl}px !important;
            height: ${toString spacing.xxxl}px !important;
            margin-block: auto !important;
            padding: 0 !important;
            box-sizing: border-box !important;
            border: var(--fw-border-width) solid var(--fw-border) !important;
            border-radius: var(--fw-radius) !important;
            box-shadow: none !important;
            outline: none !important;
          }

          #nav-bar .toolbarbutton-1 > .toolbarbutton-icon,
          #nav-bar .toolbarbutton-1 > .toolbarbutton-badge-stack {
            width: ${toString spacing.xl}px !important;
            height: ${toString spacing.xl}px !important;
            padding: ${toString spacing.sm}px !important;
            box-sizing: content-box !important;
            border-radius: var(--fw-radius) !important;
            background: none !important;
          }

          #nav-bar .toolbarbutton-1:first-child {
            margin-inline-start: ${toString spacing.sm}px !important;
          }

          #nav-bar .toolbarbutton-1 + .toolbarbutton-1 {
            margin-inline-start: ${toString spacing.xxs}px !important;
          }

          #nav-bar .toolbarbutton-1:last-child {
            margin-inline-end: ${toString spacing.sm}px !important;
          }

          #nav-bar .toolbarbutton-1:not([disabled]):hover {
            background-color: var(--fw-hover) !important;
          }

          #nav-bar .toolbarbutton-1:not([disabled]):is([open], [checked], :hover:active) {
            background-color: var(--fw-hover) !important;
            border-color: var(--fw-active) !important;
          }

          /* === URL BAR + DROPDOWN === */
          #urlbar,
          .urlbar {
            --urlbar-background-color: var(--fw-surface) !important;
            --urlbar-background-color-focus: var(--fw-surface) !important;
            --urlbar-background-border: var(--fw-border-width) solid var(--fw-border) !important;
            --urlbar-background-border-open: var(--fw-border-width) solid var(--fw-border) !important;
            --urlbar-background-border-focused: var(--fw-border-width) solid var(--fw-focus) !important;
            --urlbar-background-border-radius: var(--fw-radius) !important;
            --urlbar-background-box-shadow-open: none !important;
            --urlbar-box-background-color: var(--fw-surface) !important;
            --urlbar-box-background-color-hover: var(--fw-hover) !important;
            --urlbar-box-background-color-active: var(--fw-hover) !important;
            --urlbar-box-background-color-focus: var(--fw-hover) !important;
            --urlbarview-background-color-hover: var(--fw-hover) !important;
            --urlbarview-background-color-selected: var(--fw-active) !important;
            --urlbarview-action-button-background-color: var(--fw-surface) !important;
            --urlbarview-action-button-background-color-hover: var(--fw-hover) !important;
            border-radius: var(--fw-radius) !important;
            box-shadow: none !important;
            outline: none !important;
          }

          .urlbar-background,
          .urlbarView-background {
            border-radius: var(--fw-radius) !important;
            box-shadow: none !important;
          }

          .urlbar-input-container,
          #urlbar input {
            border: 0 !important;
            outline: none !important;
            box-shadow: none !important;
            background: transparent !important;
          }

          .urlbarView {
            color: var(--fw-text) !important;
          }

          .urlbarView-row,
          .urlbarView-row-inner,
          .urlbarView-favicon,
          .urlbarView-button {
            border-radius: var(--fw-radius) !important;
          }

          .urlbarView-url,
          .urlbarView-action {
            color: ${c.accent} !important;
          }

          .urlbarView-row[selected] .urlbarView-url,
          .urlbarView-row[selected] .urlbarView-action,
          .urlbarView-row[selected] .urlbarView-title,
          .urlbarView-row[selected] .urlbarView-row-inner {
            color: var(--fw-bg) !important;
          }

          .urlbarView-group-aboveitems,
          .urlbarView-title-separator,
          .urlbarView-secondary {
            color: var(--fw-text-muted) !important;
          }

          /* === MENUS, PANELS, TOOLTIPS, TAB HOVER PREVIEW === */
          menupopup,
          panel,
          tooltip,
          #tab-preview-panel {
            --panel-background-color: var(--fw-surface) !important;
            --panel-background: var(--fw-surface) !important;
            --panel-color: var(--fw-text) !important;
            --panel-border-color: var(--fw-border) !important;
            --panel-border-radius: var(--fw-radius) !important;
            --panel-shadow: none !important;
            --panel-shadow-margin: 0px !important;
            --menuitem-border-radius: var(--fw-radius) !important;
            --menu-background-color: var(--fw-surface) !important;
            --menu-color: var(--fw-text) !important;
            --menu-border-color: var(--fw-border) !important;
            --menuitem-hover-background-color: var(--fw-hover) !important;
          }

          tooltip {
            appearance: none !important;
            background-color: var(--fw-surface) !important;
            color: var(--fw-text) !important;
            border: var(--fw-border-width) solid var(--fw-border) !important;
            border-radius: var(--fw-radius) !important;
            box-shadow: none !important;
          }

          #tab-preview-panel .tab-preview-uri,
          #tab-preview-panel .tab-preview-pid-activeness {
            color: var(--fw-text-muted) !important;
            font-style: italic !important;
          }

          /* Hide leftover sidebar customize/settings entries */
          #sidebar-context-menu-customize-sidebar,
          #sidebar-context-menu-enable-vertical-tabs {
            display: none !important;
          }
        '';

        userContent = ''
          @-moz-document url-prefix("about:"), url-prefix("chrome:") {
            :root {
              --border-radius-small: ${g.radiusPx} !important;
              --border-radius-medium: ${g.radiusPx} !important;
              --border-radius-large: ${g.radiusPx} !important;
              --border-radius-circle: ${g.radiusPx} !important;
              --link-color: ${c.accent} !important;
              --color-accent-primary: ${c.accent} !important;
              --color-accent-primary-hover: ${c.accentBright} !important;
              --color-accent-primary-active: ${c.accentBright} !important;
              --focus-outline-color: ${c.states.focus} !important;
            }

            .top-site-outer .tile {
              border-radius: ${g.radiusPx} !important;
              box-shadow: ${g.boxShadow} !important;
            }
          }

          @-moz-document url("about:home"), url("about:newtab"), url("about:privatebrowsing") {
            :root {
              --newtab-background-color: ${c.background} !important;
              --newtab-background-color-secondary: ${c.surface} !important;
              --newtab-background-card: ${c.surface} !important;
              --newtab-text-primary-color: ${c.text} !important;
              --newtab-text-secondary-color: ${c.textMuted} !important;
              --newtab-primary-action-background: ${c.accent} !important;
              --newtab-button-background: ${c.surface} !important;
              --newtab-button-hover-background: ${c.states.hover} !important;
              --newtab-button-active-background: ${c.states.hover} !important;
              --newtab-border-color: ${c.border} !important;
              --newtab-element-hover-color: ${c.states.hover} !important;
              --newtab-wordmark-color: ${c.text} !important;
            }

            :root,
            body,
            html,
            .activity-stream,
            .activity-stream .outer-wrapper,
            .activity-stream .outer-wrapper::before {
              background: ${c.background} !important;
              background-image: none !important;
            }

            /* Square everything on the new tab page */
            * {
              border-radius: ${g.radiusPx} !important;
            }

            /* Hide new tab "Customize" button (selector varies by version) */
            .personalize-button,
            button.personalize-button,
            #personalizeButton,
            [data-l10n-id="newtab-personalize-button"] {
              display: none !important;
            }
          }
        '';


          search = {
            force = true;
            default = "ddg";
            privateDefault = "ddg";
            order = ["ddg" "google"];
            engines = {
              ddg = {
                name = "DuckDuckGo";
                urls = [{ template = "https://duckduckgo.com/?q={searchTerms}"; }];
                icon = "https://duckduckgo.com/favicon.ico";
              };
            };
          };

          settings = {
            # Enable userChrome.css support
            "toolkit.legacyUserProfileCustomizations.stylesheets" = true;
            "browser.startup.homepage" = "about:home";
            "browser.disableResetPrompt" = true;
            "browser.download.panel.shown" = true;
            "browser.feeds.showFirstRunUI" = false;
            "browser.messaging-system.whatsNewPanel.enabled" = false;
            "browser.rights.3.shown" = true;
            "browser.shell.checkDefaultBrowser" = false;
            "browser.shell.defaultBrowserCheckCount" = 1;
            "browser.startup.homepage_override.mstone" = "ignore";
            "browser.uitour.enabled" = false;
            "startup.homepage_override_url" = "";
            "trailhead.firstrun.didSeeAboutWelcome" = true;
            "browser.bookmarks.restore_default_bookmarks" = false;
            "browser.bookmarks.addedImportButton" = true;
            "browser.download.useDownloadDir" = false;
            "browser.newtabpage.activity-stream.feeds.topsites" = false;
            "browser.newtabpage.activity-stream.showSponsoredTopSites" = false;
            "browser.newtabpage.activity-stream.improvesearch.topSiteSearchShortcuts" = false;
            "browser.newtabpage.blocked" = lib.genAttrs [
              "26UbzFJ7qT9/4DhodHKA1Q=="
              "4gPpjkxgZzXPVtuEoAL9Ig=="
              "eV8/WsSLxHadrTL1gAxhug=="
              "gLv0ja2RYVgxKdp0I5qwvA=="
              "K00ILysCaEq8+bEqV/3nuw=="
              "T9nJot5PurhJSy8n038xGA=="
            ] (_: 1);
            "app.shield.optoutstudies.enabled" = false;
            "browser.discovery.enabled" = false;
            "browser.newtabpage.activity-stream.feeds.telemetry" = false;
            "browser.newtabpage.activity-stream.telemetry" = false;
            "browser.ping-centre.telemetry" = false;
            "datareporting.healthreport.service.enabled" = false;
            "datareporting.healthreport.uploadEnabled" = false;
            "datareporting.policy.dataSubmissionEnabled" = false;
            "datareporting.sessions.current.clean" = true;
            "devtools.onboarding.telemetry.logged" = false;
            "toolkit.telemetry.archive.enabled" = false;
            "toolkit.telemetry.bhrPing.enabled" = false;
            "toolkit.telemetry.enabled" = false;
            "toolkit.telemetry.firstShutdownPing.enabled" = false;
            "toolkit.telemetry.hybridContent.enabled" = false;
            "toolkit.telemetry.newProfilePing.enabled" = false;
            "toolkit.telemetry.prompted" = 2;
            "toolkit.telemetry.rejected" = true;
            "toolkit.telemetry.reportingpolicy.firstRun" = false;
            "toolkit.telemetry.server" = "";
            "toolkit.telemetry.shutdownPingSender.enabled" = false;
            "toolkit.telemetry.unified" = false;
            "toolkit.telemetry.unifiedIsOptIn" = false;
            "toolkit.telemetry.updatePing.enabled" = false;
            "identity.fxaccounts.enabled" = false;
            "signon.rememberSignons" = false;
            "privacy.trackingprotection.enabled" = true;
            "dom.security.https_only_mode" = true;
            "browser.tabs.inTitlebar" = 0;
            "sidebar.verticalTabs" = false;
            "sidebar.revamp" = true;
            "sidebar.visibility" = "hide-sidebar";
            "sidebar.main.tools" = ["history" "bookmarks"];
            "browser.uiCustomization.state" = builtins.toJSON {
              placements = {
                unified-extensions-area = [];
                widget-overflow-fixed-list = [];
                nav-bar = ["back-button" "forward-button" "vertical-spacer" "stop-reload-button" "urlbar-container" "downloads-button" "ublock0_raymondhill_net-browser-action" "_testpilot-containers-browser-action" "reset-pbm-toolbar-button" "unified-extensions-button"];
                toolbar-menubar = ["menubar-items"];
                TabsToolbar = ["firefox-view-button" "tabbrowser-tabs" "new-tab-button" "alltabs-button"];
                vertical-tabs = [];
                PersonalToolbar = ["personal-bookmarks"];
              };
              seen = ["save-to-pocket-button" "developer-button" "ublock0_raymondhill_net-browser-action" "_testpilot-containers-browser-action" "screenshot-button"];
              dirtyAreaCache = ["nav-bar" "PersonalToolbar" "toolbar-menubar" "TabsToolbar" "widget-overflow-fixed-list" "vertical-tabs"];
              currentVersion = 23;
              newElementCount = 10;
            };
          };
        };
      };
  };
}
