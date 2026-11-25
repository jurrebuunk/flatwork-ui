# A Flatwork theme is one folder with three parts:
#   tokens.nix   colours, fonts, geometry, layout (what the Nix modules read)
#   DESIGN.md    the design system: the rules behind the tokens
#   components/  the CSS component library, built on the generated vars.css
(import ./tokens.nix) // {
  design = ./DESIGN.md;
  components = ./components;
}
