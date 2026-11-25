# flatwork-saas tokens. tokens.json is the source of truth so the JS build
# (packages/react) and Nix read the same values.
builtins.fromJSON (builtins.readFile ./tokens.json)
