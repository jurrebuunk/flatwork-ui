# Releasing Flatwork UI

Flatwork UI is primarily a Nix flake, so releases are versioned Git tags. The tag is the stable thing Nix users pin.

## Recommended release shape

Use semantic-ish tags:

```bash
git tag v0.1.0
git push origin v0.1.0
```

A tagged push runs `.github/workflows/release.yml` and creates a GitHub release.

## Downloadable assets

The release workflow uploads:

- `flatwork-vars.css` — CSS variables for the default theme.
- `flatwork-palette.json` — JSON tokens for the default theme.
- `flatwork-theme-files.tar.gz` — CSS and JSON exports for all themes.
- `flatwork-wallpapers.tar.gz` — wallpaper files only.
- `flatwork-ui-vX.Y.Z.tar.gz` — docs, design notes, prompt, theme exports, and wallpapers.
- `flatwork-saas.tar.gz` — the flatwork-saas web theme package.
- `flatwork-ui-react-X.Y.Z.tgz` — the React package; its version is taken from the tag (`v0.2.0` → `0.2.0`).

If the repository has an `NPM_TOKEN` secret (an npm automation token with publish rights on the `@flatwork-ui` scope), the release also runs `npm publish`. Without it the step is skipped and the GitHub tarball is the install source.

GitHub also automatically provides source archives for the exact tag.

## Before tagging

Run:

```bash
nix flake check
nix build .#release-bundle
```

Then verify the bundle if needed:

```bash
tar -tzf result | head
```
