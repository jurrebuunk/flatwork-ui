{ config, lib, theme ? import ../themes/default.nix, ... }:

let
  c = theme.colors;
  g = theme.geometry;
  spacing = theme.layout.spacing;
in
{
  programs.firefox = {
    enable = true;

    profiles.default = {
      name = "default";

      settings = {
        # Needed for userChrome.css/userContent.css styling.
        "toolkit.legacyUserProfileCustomizations.stylesheets" = lib.mkDefault true;
      };

      userChrome = ''
        :root {
          --toolbar-bgcolor: ${c.background} !important;
          --toolbar-text-color: ${c.text} !important;
          --tab-border-color: ${c.border} !important;
          --tab-border-radius: ${g.radiusPx} !important;
          --toolbarbutton-border-radius: ${g.radiusPx} !important;
          --urlbar-border-radius: ${g.radiusPx} !important;
          --toolbarbutton-hover-bg: ${c.states.hover} !important;
        }

        #navigator-toolbox,
        #TabsToolbar,
        #nav-bar,
        #PersonalToolbar {
          background-color: ${c.background} !important;
          color: ${c.text} !important;
          border-color: ${c.border} !important;
        }

        .tab-background {
          border-radius: ${g.radiusPx} !important;
          background-color: ${c.background} !important;
          outline: none !important;
          box-shadow: ${g.boxShadow} !important;
          clip-path: none !important;
          border: ${g.border.widthPx} solid ${c.border} !important;
        }

        .tab-background[selected="true"] {
          background-color: ${c.states.active} !important;
        }

        .tab-background:hover {
          background-color: ${c.states.hover} !important;
        }

        .tab-background::before,
        .tab-background::after {
          display: none !important;
        }

        #urlbar,
        #urlbar-background,
        #searchbar {
          border-radius: ${g.radiusPx} !important;
          box-shadow: ${g.boxShadow} !important;
          outline: none !important;
          border: ${g.border.widthPx} solid ${c.border} !important;
          background-color: ${c.background} !important;
          color: ${c.text} !important;
        }

        #urlbar input,
        #urlbar .textbox-input-box {
          border: 0 !important;
          box-shadow: ${g.boxShadow} !important;
          outline: none !important;
          background: transparent !important;
          color: ${c.text} !important;
        }

        #nav-bar .toolbarbutton-1 {
          border-radius: ${g.radiusPx} !important;
          box-shadow: ${g.boxShadow} !important;
          outline: none !important;
          border: ${g.border.widthPx} solid ${c.border} !important;
          box-sizing: border-box;
          margin-inline: ${toString spacing.xxs}px !important;
        }

        menupopup,
        panel,
        tooltip {
          --panel-background: ${c.background} !important;
          --panel-color: ${c.text} !important;
          --panel-border-color: ${c.border} !important;
          border-radius: ${g.radiusPx} !important;
        }
      '';

      userContent = ''
        @-moz-document url-prefix("about:"), url-prefix("chrome:") {
          :root {
            --border-radius-medium: ${g.radiusPx} !important;
            --in-content-page-background: ${c.background} !important;
            --in-content-page-color: ${c.text} !important;
            --in-content-primary-button-background: ${c.accent} !important;
            --in-content-border-color: ${c.border} !important;
          }

          body,
          html {
            background: ${c.background} !important;
            color: ${c.text} !important;
          }

          button,
          input,
          textarea,
          select,
          .top-site-outer .tile {
            border-radius: ${g.radiusPx} !important;
            box-shadow: ${g.boxShadow} !important;
          }
        }

        @-moz-document url("about:home"), url("about:newtab") {
          :root,
          body,
          html,
          .activity-stream,
          .activity-stream .outer-wrapper,
          .activity-stream .outer-wrapper::before {
            background: ${c.background} !important;
            background-image: none !important;
            color: ${c.text} !important;
          }
        }
      '';
    };
  };
}
