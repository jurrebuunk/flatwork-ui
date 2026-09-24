# Agent prompt: install Flatwork UI full experience

Give this prompt to a coding agent inside a NixOS/Home Manager repo:

```text
Set up the full Flatwork UI desktop experience in this NixOS/Home Manager repo.

Use the public flake:

  github:jurrebuunk/flatwork-ui

Goal:
- Do NOT manually recreate app configs from tokens.
- Do NOT write new custom Firefox/Waybar/Rofi/GTK/Alacritty configs.
- Use the full experience modules exported by the flake.
- Keep only machine-specific/session-specific config local.

Requirements:
- Add `flatwork-ui` as a flake input.
- Make it follow this repo's `nixpkgs`.
- Pass the theme through `specialArgs` and `home-manager.extraSpecialArgs` as:

  theme = inputs.flatwork-ui.lib.themes.default;

- Import:

  inputs.flatwork-ui.nixosModules.fonts

  and in Home Manager import:

  inputs.flatwork-ui.homeManagerModules.default

This should provide the full experience:
- GTK styling
- Mako notifications
- full Waybar config/style
- Rofi launcher styling
- SwayOSD styling
- Alacritty theme
- Firefox full config/style
- Fastfetch theme
- Bash prompt

Important:
- Niri is expected. If this repo does not enable Niri yet, enable it locally in the machine config.
- Keep local Niri keybindings, monitor/output config, startup apps, user account config, secrets, host hardware config, etc. local.
- Do not copy files out of the Flatwork UI repo.
- Do not vendor the theme.
- Do not duplicate modules that Flatwork UI already provides.
- If existing local modules configure Firefox, Waybar, Rofi, GTK, Mako, SwayOSD, Alacritty, Fastfetch, or Bash prompt, remove those imports or disable them to avoid conflicts.
- If the machine's temperature sensor path differs, set:

  flatwork.waybar.temperature.hwmonPath = null;

  or set the correct `/sys/devices/.../hwmon...` path.

Example flake input:

  flatwork-ui = {
    url = "github:jurrebuunk/flatwork-ui";
    inputs.nixpkgs.follows = "nixpkgs";
  };

Example NixOS module imports:

  modules = [
    inputs.flatwork-ui.nixosModules.fonts
    ...
  ];

Example Home Manager setup:

  home-manager.extraSpecialArgs = {
    inherit inputs;
    theme = inputs.flatwork-ui.lib.themes.default;
  };

  home-manager.users.<user> = {
    imports = [
      inputs.flatwork-ui.homeManagerModules.default
    ];

    # keep normal home.username/home.homeDirectory/home.stateVersion here
  };

After editing:
- Run `nix flake check` if available.
- Run an evaluation/build check only, not a switch, unless I explicitly ask.
- Do not delete old local config files until the new config evaluates successfully and I confirm.
```
