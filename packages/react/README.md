# @flatwork-ui/react

React components for the Flatwork design system. They render the markup of a
theme's CSS component library (`themes/<name>/components`), so the look comes
entirely from the theme stylesheet you load.

Themes with a web component library: **flatwork-saas** (dark, light, system).

## Install

From a GitHub release (no registry needed, pinned to a version):

```bash
npm i https://github.com/jurrebuunk/flatwork-ui/releases/download/v0.2.0/flatwork-ui-react-0.2.0.tgz
```

From npm, once releases are published there:

```bash
npm i @flatwork-ui/react
```

Needs React 18 or newer.

## Use

```tsx
import "@flatwork-ui/react/styles/flatwork-saas.css"; // fonts + tokens + components, once
import { FlatworkRoot, ToastProvider, Button, Field, Input } from "@flatwork-ui/react";

export function App() {
  return (
    <FlatworkRoot mode="system">
      <ToastProvider>
        <Field label="Email" help="We'll never share your email.">
          <Input type="email" placeholder="you@buunk.org" />
        </Field>
        <Button variant="primary">Save changes</Button>
      </ToastProvider>
    </FlatworkRoot>
  );
}
```

* Everything must render inside `<FlatworkRoot>` (a `div.fw`): it carries the tokens, font and colours. `mode` is `dark` (default), `light` or `system`.
* `<ToastProvider>` is only needed for `useToast()`.
* Tokens as data: `import tokens from "@flatwork-ui/react/tokens/flatwork-saas.json"`.
* The bundle is marked `"use client"`, so it works in Next.js App Router.
* Router links: `NavItem` takes `as={Link}`; `Breadcrumb` takes `renderLink`.

## Components

| Area | Components |
| --- | --- |
| Base | `FlatworkRoot`, `Text`, `Kbd`, `Spinner`, `VisuallyHidden`, `cx` |
| Buttons | `Button`, `ButtonLink`, `ButtonGroup` |
| Forms | `Field`, `Input`, `Textarea`, `Select`, `InputGroup`, `Affix`, `Checkbox`, `Radio`, `Switch`, `Range`, `Dropzone`, `Fieldset` |
| Feedback | `Alert`, `Toast`, `ToastProvider`, `useToast`, `Badge`, `Tag`, `Progress`, `Skeleton`, `EmptyState` |
| Navigation | `TopNav`, `Brand`, `SideNav`, `NavItem`, `NavGroupLabel`, `Tabs`, `TabList`, `Tab`, `TabPanel`, `SegmentedControl`, `Breadcrumb`, `Pagination`, `Stepper` |
| Menus & overlays | `Menu`, `MenuItem`, `MenuLabel`, `MenuSeparator`, `DropdownMenu`, `Tooltip`, `Popover`, `Dialog`, `Drawer`, `CommandPalette` |
| Data | `Card`, `CardHeader`, `CardBody`, `CardFooter`, `StatCard`, `Table`, `SortableHeader`, `List`, `ListItem`, `DescriptionList`, `Accordion`, `AccordionItem`, `CodeBlock`, `Divider`, `Avatar`, `AvatarGroup` |
| Icons | `IconPlus`, `IconSearch`, `IconChevronDown`, … (16px stroke icons from the spec) |

Dialogs and drawers use the native `<dialog>` element, so focus trapping, Esc
and focus return come from the browser. The design rules each component
follows are in [`themes/flatwork-saas/DESIGN.md`](../../themes/flatwork-saas/DESIGN.md).

## Develop

From the repo root:

```bash
npm install
npm run dev        # showcase of every component at http://localhost:5173
npm run typecheck
npm run build
```

The showcase (`showcase/main.tsx`) mirrors the seven pages of the original
flatwork-saas spec and has a dark/light/system switch.
