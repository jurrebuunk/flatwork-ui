# flatwork-saas design system

Calm, flat, precise web interfaces. The same family as the Flatwork desktop
theme (the `#1b1818` background, the muted blue accent `#8aa1a8`, 1px
structural borders) translated for products people use in a browser: a sans
interface face, gentle radii and a light mode.

Values live in [`tokens.json`](./tokens.json); the CSS is in
[`components/`](./components); the React components in `packages/react`
render that CSS's markup.

## Principles

* Mostly background, surface, text and **one accent**. Semantic colours only carry meaning.
* Hierarchy comes from spacing, weight and colour, not from size jumps or decoration.
* Surfaces are separated by **1px borders, not shadows**. Shadows appear only on floating layers (`--fw-shadow-pop`).
* **Colour is never the only signal:** every status also has an icon or a word.
* Machine values (IDs, IPs, timestamps, numbers, hosts) are set in **IBM Plex Mono**; everything people read is **Geist**.
* Dark is the default; light is the same token set under `data-theme="light"`; `data-theme="system"` follows the OS.

Avoid: gradients, glassmorphism, glow, decorative shadows, oversized type, saturated colour, accent-coloured decoration.

## Colour

| Token | Dark | Light | Use |
| --- | --- | --- | --- |
| `bg` | `#1b1818` | `#f6f5f5` | Page background |
| `surface` | `#221e1e` | `#ffffff` | Cards, panels, nav |
| `surface-2` | `#2a2525` | `#f1efef` | Hover, current item, read-only fields |
| `border` / `border-strong` | `#3a3434` / `#4a4444` | `#e4e0e0` / `#d3cdcd` | Separation / control outlines |
| `heading` / `text` / `muted` | `#ece9e9` / `#c4c1c1` / `#9a9595` | `#1b1818` / `#3a3535` / `#625c5c` | Text hierarchy |
| `accent` | `#8aa1a8` | `#4b6670` | Primary action, checked, current |
| `link` / `focus` | `#a5bbc2` | `#3f5961` | Links, 2px focus ring |
| `success` `warning` `error` `info` | | | Status; each has `-bg` and `-border` |
| `danger` | `#c97070` | `#a33b3b` | Destructive buttons only |

## Typography

Geist for interface language, IBM Plex Mono for machine values only. Weights 400 / 500 / 600.

| Role | Size / line-height / weight |
| --- | --- |
| display | 28 / 1.2 / 600, −0.02em |
| title | 22 / 1.25 / 600, −0.02em |
| heading | 16 / 1.35 / 600, −0.01em |
| body | 14 / 1.5 / 400 |
| label | 13 / 1.4 / 500 |
| caption | 12 / 1.4 / 400, muted |
| mono | 13 / 400 |

## Space, radius, motion

* **Spacing:** 4px base — 4, 8, 12, 16, 20, 24, 32, 48.
* **Radius:** `xs` 4 (badges, checkboxes), `sm` 6 (controls), `md` 9 (cards), `lg` 12 (dialogs), `full` (switches, avatars, counts).
* **Focus:** 2px ring in `focus`, 2px offset, on `:focus-visible`.
* **Motion:** 120ms for hover, 220ms for panels, `ease-out`. Respect `prefers-reduced-motion`.
* **Icons:** [Material Symbols](https://fonts.google.com/icons) **Rounded**, weight 400, grade 0, optical size 20, shown at 18px (16px in compact controls), `currentColor`. Rounded matches the round caps and joins of the original stroke icons; weight 400 matches their stroke. Use the filled style only for active/selected states (the current nav item).

## Components

**Buttons.** One primary action per view. Secondary for everything else, ghost inside toolbars and menus, danger only for destructive confirmation. Sizes sm 32 · md 40 (default) · lg 44; use lg for touch-first and auth pages. Leading icon for the action, trailing chevron for menus or navigation (16px, 8px gap). Icon buttons are square and always have an `aria-label` and a tooltip. Joined secondary buttons for related actions; block width for forms and narrow panels.

**Form controls.** Every control sits in a field: label above, control, then help or error text. Labels are always visible; placeholders are examples, not labels. Errors set `aria-invalid` and point to their message with `aria-describedby`.

**Alerts** are inline, persistent, inside the content flow: `role="alert"` for errors, `role="status"` otherwise. **Toasts** are transient, bottom-right, auto-dismiss after 5s (errors stay), stacked with 8px gap.

**Badges** are read-only status (22px, radius xs). **Tags** are user-editable, removable tokens (26px). **Tooltips** are inverted, 12px, appear after 500ms, label icon buttons and never hold essential information.

**Navigation.** The current location always uses `aria-current` and the `surface-2` fill. Tabs underline the active tab in accent; segmented controls are for switching views of the same data.

**Data display.** Tables have 40px headers, 48px rows, row hover, selectable rows, and numbers right-aligned in mono; they scroll horizontally on narrow screens. Description lists for key/value detail, lists for people and objects.

**Overlays.** Floating layers are the only place shadows appear. Dialogs trap focus, close on Esc and return focus to their trigger. Popovers are non-modal, anchored 8px from their trigger and close on outside click. The command palette opens with ⌘K; arrows move, ↵ runs.
