# Components

Plain CSS, one file per component group, all `@import`ed from `index.css`.

- Classes use the `fw-` prefix (`.fw-btn`, `.fw-btn-primary`); state classes are `is-*` (`is-active`, `is-error`).
- Colours, radii, fonts and motion come only from `--fw-*` variables, generated from `../tokens.json`.
- Everything renders inside a root element with `class="fw"`; `data-theme="dark|light|system"` picks the mode.
- `is-hover` / `is-focus` exist so docs can show states statically; apps rely on real `:hover` / `:focus-visible`.

The React components in `packages/react` render exactly this markup, so any theme that implements these classes works with them.
