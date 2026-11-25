# A Flatwork theme is one folder with three parts:
#   tokens.nix   design tokens (here read from tokens.json)
#   DESIGN.md    the design system: the rules behind the tokens
#   components/  the CSS component library, built on the generated tokens
# flatwork-saas is a web theme: it has no desktop (Home Manager) tokens.
(import ./tokens.nix) // {
  design = ./DESIGN.md;
  components = ./components;
}
