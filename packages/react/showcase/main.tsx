// Every component in the spec's seven sections, built from the library.
// `npm run dev` from the repo root.
import { StrictMode, useState, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import "../dist/styles/flatwork-saas/flatwork-saas.css";
import "./showcase.css";
import {
  Accordion, AccordionItem, Affix, Alert, Avatar, AvatarGroup, Badge, Brand, Breadcrumb, Button, ButtonGroup, ButtonLink,
  Card, CardBody, CardFooter, CardHeader, Checkbox, CodeBlock, CommandPalette, DescriptionList, Dialog, Divider, Drawer,
  DropdownMenu, Dropzone, EmptyState, Field, Fieldset, FlatworkRoot, Input, InputGroup, Kbd, List, ListItem, Menu, MenuItem,
  MenuLabel, MenuSeparator, NavGroupLabel, NavItem, Pagination, Popover, Progress, Radio, Range, SegmentedControl, Select,
  SideNav, Skeleton, SortableHeader, Spinner, StatCard, Stepper, Switch, Tab, Table, TabList, TabPanel, Tabs, Tag, Text,
  Textarea, ToastProvider, Tooltip, TopNav, useToast, VisuallyHidden, type ThemeMode,
  Icon,
} from "../src";

function Section({ title, desc, children }: { title: string; desc?: ReactNode; children: ReactNode }) {
  return (
    <section className="sec">
      <h2 className="sec-title">{title}</h2>
      {desc && <p className="sec-desc">{desc}</p>}
      {children}
    </section>
  );
}

function Sheet({ n, title, intro, children }: { n: string; title: string; intro: ReactNode; children: ReactNode }) {
  return (
    <div className="sheet" id={title.toLowerCase().replace(/\s+/g, "-")}>
      <header className="sheet-head">
        <span className="spec">flatwork-saas / {n}</span>
        <h1>{title}</h1>
        <p>{intro}</p>
      </header>
      {children}
    </div>
  );
}

function Foundations() {
  const sizes = ["display", "title", "heading", "body", "label", "caption", "mono"] as const;
  const sample: Record<(typeof sizes)[number], string> = {
    display: "Your workspace, at a glance",
    title: "Sign in to buunk",
    heading: "Project settings",
    body: "Changes are saved automatically and synced to every device signed in to this account.",
    label: "Email address",
    caption: "Last updated 3 minutes ago",
    mono: "auth.buunk.org · 192.168.1.42 · 2026-11-25 19:56",
  };
  const swatches = ["bg", "surface", "surface-2", "border", "border-strong", "heading", "text", "muted", "accent", "accent-hover", "link", "on-accent", "success", "warning", "error", "danger", "info-bg", "error-bg"];
  return (
    <Sheet n="01" title="Foundations" intro={<>Tokens every component is built from. Dark is the default theme; light is the same token set under <code>[data-theme="light"]</code>.</>}>
      <Section title="Color tokens" desc="Mostly background, surface, text and one accent. Semantic colors only carry meaning.">
        <div className="cols-4" style={{ gridTemplateColumns: "repeat(6, minmax(0, 1fr))", gap: 16 }}>
          {swatches.map((s) => (
            <div key={s} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ height: 64, borderRadius: 9, border: "1px solid var(--fw-border)", background: `var(--fw-${s})` }} />
              <span className="spec">--fw-{s}</span>
            </div>
          ))}
        </div>
      </Section>
      <Section title="Typography" desc="Geist for interface language, IBM Plex Mono for machine values only. Weights 400 / 500 / 600.">
        <div className="panel" style={{ display: "grid", gridTemplateColumns: "200px minmax(0, 1fr)", gap: "20px 32px", alignItems: "baseline" }}>
          {sizes.map((v) => [
            <span key={`${v}-k`} className="spec">{v}</span>,
            <Text key={v} variant={v} as="p" style={{ margin: 0 }}>{sample[v]}</Text>,
          ])}
          <span className="spec">inline</span>
          <p className="fw-t-body">
            <strong style={{ color: "var(--fw-heading)", fontWeight: 600 }}>Strong</strong>, <a href="#">link</a>, <code>inline code</code>, <mark>highlight</mark>, <Kbd>⌘</Kbd> <Kbd>K</Kbd>, <small className="fw-t-muted">small</small>
          </p>
        </div>
      </Section>
    </Sheet>
  );
}

function Buttons() {
  const variants = ["primary", "secondary", "ghost", "danger"] as const;
  return (
    <Sheet n="02" title="Buttons" intro="One primary action per view. Secondary for everything else, ghost inside toolbars and menus, danger only for destructive confirmation.">
      <Section title="Variants × states">
        <div className="panel">
          <div className="matrix" style={{ gridTemplateColumns: "140px repeat(5, minmax(0, 1fr))" }}>
            <span />
            {["default", "hover", "focus-visible", "disabled", "loading"].map((s) => <span key={s} className="spec">{s}</span>)}
            {variants.map((v) => [
              <span key={`${v}-k`} className="spec">{v}</span>,
              <div key={`${v}-1`}><Button variant={v}>Save changes</Button></div>,
              <div key={`${v}-2`}><Button variant={v} className="is-hover">Save changes</Button></div>,
              <div key={`${v}-3`}><Button variant={v} className="is-focus">Save changes</Button></div>,
              <div key={`${v}-4`}><Button variant={v} disabled>Save changes</Button></div>,
              <div key={`${v}-5`}><Button variant={v} loading>Saving…</Button></div>,
            ])}
            <span className="spec">link</span>
            <div><ButtonLink variant="link" href="#">Forgot password?</ButtonLink></div>
            <div><ButtonLink variant="link" href="#" className="is-hover">Forgot password?</ButtonLink></div>
            <div><ButtonLink variant="link" href="#" className="is-focus">Forgot password?</ButtonLink></div>
            <div><Button variant="link" disabled>Forgot password?</Button></div>
            <div><span className="spec">—</span></div>
          </div>
        </div>
      </Section>
      <div className="cols-2">
        <Section title="Sizes" desc="sm 32 · md 40 (default) · lg 44. Use lg for touch-first and auth pages.">
          <div className="row"><Button variant="primary" size="sm">Small</Button><Button variant="primary">Medium</Button><Button variant="primary" size="lg">Large</Button></div>
          <div className="row"><Button size="sm">Small</Button><Button>Medium</Button><Button size="lg">Large</Button></div>
        </Section>
        <Section title="With icons" desc="Leading icon for the action, trailing chevron for menus or navigation. 16px, 8px gap.">
          <div className="row">
            <Button variant="primary" leadingIcon={<Icon name="add" />}>New project</Button>
            <Button leadingIcon={<Icon name="download" />}>Export</Button>
            <Button trailingIcon={<Icon name="keyboard_arrow_down" />}>Options</Button>
            <ButtonLink variant="ghost" href="#" trailingIcon={<Icon name="arrow_forward" />}>Continue</ButtonLink>
          </div>
        </Section>
        <Section title="Icon buttons" desc={<>Square, always with <code>aria-label</code> and a tooltip.</>}>
          <div className="row">
            <Tooltip content="Edit"><Button iconOnly size="sm" aria-label="Edit"><Icon name="edit" /></Button></Tooltip>
            <Tooltip content="Copy"><Button iconOnly aria-label="Copy"><Icon name="content_copy" /></Button></Tooltip>
            <Tooltip content="More actions"><Button variant="ghost" iconOnly aria-label="More actions"><Icon name="more_horiz" /></Button></Tooltip>
            <Tooltip content="Close"><Button variant="ghost" iconOnly size="lg" aria-label="Close"><Icon name="close" /></Button></Tooltip>
            <Tooltip content="Add"><Button variant="primary" iconOnly aria-label="Add"><Icon name="add" /></Button></Tooltip>
            <Tooltip content="Delete"><Button variant="danger" iconOnly aria-label="Delete"><Icon name="delete" /></Button></Tooltip>
          </div>
        </Section>
        <Section title="Group & block" desc="Joined secondary buttons for related actions; block width for forms and narrow panels.">
          <div className="row">
            <ButtonGroup aria-label="Range"><Button size="sm">24h</Button><Button size="sm">7d</Button><Button size="sm">30d</Button></ButtonGroup>
            <ButtonGroup aria-label="Deploy">
              <Button variant="primary">Deploy</Button>
              <Button variant="primary" iconOnly aria-label="Deploy options" style={{ borderLeftColor: "var(--fw-on-accent)" }}><Icon name="keyboard_arrow_down" /></Button>
            </ButtonGroup>
          </div>
          <div style={{ maxWidth: 360 }}><Button variant="primary" size="lg" block>Sign in</Button></div>
        </Section>
      </div>
    </Sheet>
  );
}

function Forms() {
  const [timeout, setTimeoutValue] = useState(30);
  const [desc, setDesc] = useState("");
  return (
    <Sheet n="03" title="Form controls" intro={<>Every control sits in a <code>Field</code>: label above, control, then help or error text. Labels are always visible; placeholders are examples, not labels.</>}>
      <Section title="Text input — states">
        <div className="cols-4">
          <Field label="Default" help="We'll never share your email."><Input placeholder="you@buunk.org" /></Field>
          <Field label="Hover"><Input className="is-hover" placeholder="you@buunk.org" /></Field>
          <Field label="Focus"><Input className="is-focus" defaultValue="jurre@buunk.org" /></Field>
          <Field label="Error" error="Enter a valid email address."><Input defaultValue="jurre@buunk" /></Field>
          <Field label="Disabled"><Input defaultValue="Not editable" disabled /></Field>
          <Field label="Read-only"><Input mono defaultValue="kc-client-7f3a91" readOnly /></Field>
          <Field label="Optional" optional><Input placeholder="Company name" /></Field>
          <Field label="Small"><Input size="sm" placeholder="Filter…" /></Field>
        </div>
      </Section>
      <Section title="Input types & affixes">
        <div className="cols-4">
          <Field label="Search">
            <InputGroup><Affix><Icon name="search" /></Affix><Input type="search" placeholder="Search projects" style={{ paddingLeft: 0 }} /><Affix><Kbd>⌘K</Kbd></Affix></InputGroup>
          </Field>
          <Field label="Domain">
            <InputGroup><Affix boxed>https://</Affix><Input mono defaultValue="dash" /><Affix boxed end>.buunk.org</Affix></InputGroup>
          </Field>
          <Field label="Password" help="Strength: fair — add a symbol or more length.">
            <InputGroup><Input type="password" defaultValue="hunter2hunter2" /><Button variant="ghost" iconOnly size="sm" aria-label="Show password" style={{ marginRight: 4 }}><Icon name="visibility" /></Button></InputGroup>
            <Progress meter value={2} max={4} tone="warning" aria-label="Password strength" />
          </Field>
          <Field label="Number"><InputGroup><Input type="number" mono defaultValue="8080" /><Affix boxed end>port</Affix></InputGroup></Field>
          <Field label="Date"><Input type="date" mono defaultValue="2026-11-25" /></Field>
          <Field label="Time"><Input type="time" mono defaultValue="19:56" /></Field>
          <Field label="Select"><Select defaultValue="UTC"><option>Europe/Amsterdam</option><option>UTC</option><option>America/New_York</option></Select></Field>
        </div>
      </Section>
      <div className="cols-2">
        <Section title="Textarea">
          <Field label="Description" help="Markdown supported." labelEnd={<span className="spec">{desc.length} / 280</span>}>
            <Textarea placeholder="What is this project for?" maxLength={280} value={desc} onChange={(e) => setDesc(e.target.value)} />
          </Field>
        </Section>
        <Section title="File upload">
          <Field label="Avatar" labelAsText><Dropzone hint="PNG, JPG or SVG · max 2 MB" accept="image/*" /></Field>
        </Section>
      </div>
      <div className="cols-4">
        <Section title="Checkbox">
          <div className="stack">
            <Checkbox label="Unchecked" />
            <Checkbox label="Checked" defaultChecked />
            <Checkbox label="Indeterminate" indeterminate />
            <Checkbox label="Disabled" disabled />
            <Checkbox label="Email notifications" description="Get a message when a deploy fails." defaultChecked />
          </div>
        </Section>
        <Section title="Radio">
          <fieldset style={{ border: 0, margin: 0, padding: 0 }} className="stack">
            <legend className="fw-label" style={{ marginBottom: 10 }}>Plan</legend>
            <Radio name="plan" label="Personal" defaultChecked />
            <Radio name="plan" label="Team" />
            <Radio name="plan" label="Enterprise" />
            <Radio name="plan" label="Legacy (disabled)" disabled />
          </fieldset>
        </Section>
        <Section title="Switch">
          <div className="stack">
            <Switch label="Two-factor auth" defaultChecked />
            <Switch label="Public profile" />
            <Switch label="Beta features" disabled />
            <Switch label="Maintenance mode" description="Shows a notice to all users." spread style={{ padding: "12px 0", borderTop: "1px solid var(--fw-border)" }} />
          </div>
        </Section>
        <Section title="Range">
          <Field label="Session timeout" labelEnd={<span className="spec" style={{ color: "var(--fw-heading)" }}>{timeout} min</span>}>
            <Range min={5} max={60} value={timeout} onChange={(e) => setTimeoutValue(Number(e.target.value))} />
          </Field>
          <Field label="Disabled"><Range defaultValue={70} disabled style={{ opacity: 0.45 }} /></Field>
        </Section>
      </div>
      <Section title="Composed: fieldset">
        <form style={{ maxWidth: 720 }} onSubmit={(e) => e.preventDefault()}>
          <Fieldset legend="Profile">
            <div className="cols-2" style={{ gap: 16 }}>
              <Field label="First name"><Input defaultValue="Jurre" /></Field>
              <Field label="Last name"><Input defaultValue="Buunk" /></Field>
            </div>
            <Field label="Email"><Input type="email" defaultValue="jurre@buunk.org" /></Field>
            <hr />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <Button>Cancel</Button>
              <Button variant="primary" type="submit">Save profile</Button>
            </div>
          </Fieldset>
        </form>
      </Section>
    </Sheet>
  );
}

function FeedbackSheet() {
  const toast = useToast();
  const [tags, setTags] = useState(["admin", "dashboard", "openid"]);
  return (
    <Sheet n="04" title="Feedback" intro="Status, progress and system messages. Color is never the only signal: every status also has an icon or a word.">
      <div className="cols-2">
        <Section title="Alert" desc={<>Inline, persistent, inside the content flow. <code>role="alert"</code> for errors, <code>role="status"</code> otherwise.</>}>
          <div className="stack">
            <Alert title="Maintenance scheduled">Keycloak will restart on Sunday at <code>03:00 UTC</code>.</Alert>
            <Alert tone="success" title="Email verified">You can now sign in with your new address.</Alert>
            <Alert tone="warning" title="Certificate expires soon">The TLS certificate for <code>auth.buunk.org</code> expires in 6 days.</Alert>
            <Alert tone="error" title="Deploy failed" onDismiss={() => {}}>Build exited with code <code>137</code>. <a href="#">View logs</a></Alert>
            <Alert tone="neutral">Compact, single line — no title.</Alert>
          </div>
        </Section>
        <Section title="Toast" desc="Transient, bottom-right, 5s auto-dismiss (errors stay). Stack with 8px gap.">
          <div className="row">
            <Button onClick={() => toast.show({ title: "Changes saved", description: "Project settings were updated." })}>Show success</Button>
            <Button onClick={() => toast.show({ tone: "info", title: "3 sessions revoked", actions: <Button variant="link" style={{ fontSize: 13 }}>Undo</Button> })}>Show with action</Button>
            <Button onClick={() => toast.show({ tone: "error", title: "Couldn't reach server", description: "Check your connection and try again." })}>Show error</Button>
          </div>
        </Section>
      </div>
      <div className="cols-3">
        <Section title="Badge" desc="Read-only status. 22px, radius xs.">
          <div className="row">
            <Badge>Draft</Badge><Badge tone="accent">Beta</Badge>
            <Badge tone="success" dot>Online</Badge><Badge tone="warning" dot>Degraded</Badge><Badge tone="error" dot>Offline</Badge>
          </div>
          <div className="row"><Badge style={{ fontFamily: "var(--fw-mono)", fontSize: 11 }}>v2.4.1</Badge><Badge count>3</Badge><Badge count>99+</Badge></div>
        </Section>
        <Section title="Tag" desc="User-editable, removable token. 26px.">
          <div className="row">{tags.map((t) => <Tag key={t} onRemove={() => setTags(tags.filter((x) => x !== t))}>{t}</Tag>)}</div>
        </Section>
        <Section title="Tooltip" desc="Inverted, 12px, 500ms delay. Labels icon buttons; never holds essential info.">
          <div className="row" style={{ gap: 28, paddingTop: 36 }}>
            <Tooltip content="Copy to clipboard"><Button iconOnly size="sm" aria-label="Copy to clipboard"><Icon name="content_copy" /></Button></Tooltip>
            <Tooltip content="Search" shortcut="⌘K"><Button iconOnly size="sm" aria-label="Search"><Icon name="search" /></Button></Tooltip>
          </div>
        </Section>
      </div>
      <div className="cols-3">
        <Section title="Progress">
          <div className="stack" style={{ gap: 16 }}>
            <Field label="Uploading backup.tar.gz" labelAsText labelEnd={<span className="spec">64%</span>}><Progress value={64} aria-label="Upload" /></Field>
            <Field label="Storage" labelAsText labelEnd={<span className="spec">8.4 / 10 GB</span>}><Progress meter value={84} tone="warning" aria-label="Storage" /></Field>
            <Field label="Indeterminate" labelAsText><Progress aria-label="Loading" /></Field>
          </div>
        </Section>
        <Section title="Spinner & skeleton">
          <div className="row" style={{ gap: 20, color: "var(--fw-muted)" }}>
            <Spinner label="Loading" /><Spinner size="lg" label="Loading" />
            <span className="row" style={{ gap: 8, fontSize: 13 }}><Spinner />Loading sessions…</span>
          </div>
          <Card aria-busy="true" style={{ padding: 16, gap: 12, flexDirection: "row", alignItems: "center" }}>
            <Skeleton width={40} height={40} circle />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}><Skeleton width="60%" /><Skeleton width="40%" height={10} /></div>
          </Card>
        </Section>
        <Section title="Empty state">
          <EmptyState icon={<Icon name="folder" />} title="No projects yet" description="Create a project to start deploying to buunk.org." action={<Button variant="primary" size="sm">New project</Button>} />
        </Section>
      </div>
    </Sheet>
  );
}

function NavigationSheet() {
  const [page, setPage] = useState(1);
  return (
    <Sheet n="05" title="Navigation" intro={<>App shell and wayfinding. Current location always uses <code>aria-current</code> and the surface-2 fill.</>}>
      <Section title="Top bar">
        <TopNav
          brand={<Brand href="#" mark={<span style={{ fontWeight: 700, fontSize: 12 }}>b</span>}>buunk</Brand>}
          end={<>
            <Button size="sm" leadingIcon={<Icon name="search" />} style={{ width: 220, justifyContent: "flex-start", color: "var(--fw-muted)", fontWeight: 400 }}>Search…<Kbd style={{ marginLeft: "auto" }}>⌘K</Kbd></Button>
            <Tooltip content="Notifications"><Button variant="ghost" iconOnly size="sm" aria-label="Notifications"><Icon name="notifications" /></Button></Tooltip>
            <Avatar online>JB</Avatar>
          </>}
        >
          <a href="#" aria-current="page">Overview</a><a href="#">Projects</a><a href="#">Deployments</a><a href="#">Users</a><a href="#">Settings</a>
        </TopNav>
      </Section>
      <div style={{ display: "grid", gridTemplateColumns: "248px minmax(0, 1fr)", gap: 48, alignItems: "start" }}>
        <Section title="Side nav">
          <SideNav aria-label="Workspace">
            <NavItem href="#" icon={<Icon name="home" />} current>Overview</NavItem>
            <NavItem href="#" icon={<Icon name="folder" />} badge={<Badge>12</Badge>}>Projects</NavItem>
            <NavItem href="#" icon={<Icon name="arrow_forward" />} badge={<Badge tone="error">1</Badge>}>Deployments</NavItem>
            <NavItem href="#" icon={<Icon name="bar_chart" />}>Analytics</NavItem>
            <NavGroupLabel>Identity</NavGroupLabel>
            <NavItem href="#" icon={<Icon name="person" />}>Users</NavItem>
            <NavItem href="#" icon={<Icon name="lock" />}>Clients</NavItem>
            <NavItem href="#" icon={<Icon name="settings" />}>Realm settings</NavItem>
          </SideNav>
        </Section>
        <div className="stack" style={{ gap: 40 }}>
          <div className="cols-2">
            <Section title="Tabs">
              <Tabs defaultValue="general">
                <TabList aria-label="Project">
                  <Tab value="general">General</Tab>
                  <Tab value="members" badge={<Badge>4</Badge>}>Members</Tab>
                  <Tab value="security">Security</Tab>
                  <Tab value="billing">Billing</Tab>
                </TabList>
                {["general", "members", "security", "billing"].map((v) => <TabPanel key={v} value={v} className="fw-t-caption" style={{ paddingTop: 12 }}>The {v} panel.</TabPanel>)}
              </Tabs>
            </Section>
            <Section title="Segmented control">
              <div className="row">
                <SegmentedControl label="View" options={[{ value: "day", label: "Day" }, { value: "week", label: "Week" }, { value: "month", label: "Month" }]} />
                <SegmentedControl label="Layout" options={[{ value: "grid", label: null, icon: <Icon name="grid_view" />, ariaLabel: "Grid" }, { value: "list", label: null, icon: <Icon name="list" />, ariaLabel: "List" }]} />
              </div>
            </Section>
          </div>
          <div className="cols-2">
            <Section title="Breadcrumb"><Breadcrumb items={[{ label: "buunk", href: "#" }, { label: "Projects", href: "#" }, { label: "dashboard" }]} /></Section>
            <Section title="Pagination"><Pagination page={page} count={12} onPageChange={setPage} /></Section>
          </div>
          <Section title="Stepper"><Stepper aria-label="Setup progress" steps={["Account", "Workspace", "Invite team", "Done"]} current={1} /></Section>
          <Section title="Dropdown menu">
            <div className="row row-top" style={{ gap: 32 }}>
              <DropdownMenu label="Project actions" trigger={<Button trailingIcon={<Icon name="keyboard_arrow_down" />}>Actions</Button>}>
                <MenuLabel>Project</MenuLabel>
                <MenuItem icon={<Icon name="edit" />} shortcut="F2">Rename</MenuItem>
                <MenuItem icon={<Icon name="content_copy" />} shortcut="⌘D">Duplicate</MenuItem>
                <MenuItem icon={<Icon name="download" />}>Export</MenuItem>
                <MenuSeparator />
                <MenuItem icon={<Icon name="delete" />} shortcut="⌫" danger>Delete</MenuItem>
              </DropdownMenu>
              <div className="stack" style={{ gap: 8 }}>
                <span className="spec">select menu · single choice</span>
                <Menu role="listbox" aria-label="Role" style={{ width: 220 }}>
                  <MenuItem as="li" role="option" aria-selected={false}>Viewer</MenuItem>
                  <MenuItem as="li" role="option" aria-selected selected>Editor</MenuItem>
                  <MenuItem as="li" role="option" aria-selected={false}>Admin</MenuItem>
                  <MenuItem as="li" role="option" aria-selected={false}>Owner</MenuItem>
                </Menu>
              </div>
            </div>
          </Section>
        </div>
      </div>
    </Sheet>
  );
}

const sessions = [
  { user: "Jurre Buunk", initials: "JB", client: "dashboard-web", ip: "192.168.1.42", status: "Active", tone: "success", started: "19:42", reqs: "1,284" },
  { user: "A. Kramer", initials: "AK", client: "grafana", ip: "10.0.4.17", status: "Active", tone: "success", started: "18:05", reqs: "312", selected: true },
  { user: "S. de Vries", initials: "SV", client: "dashboard-web", ip: "10.0.4.22", status: "Idle", tone: "warning", started: "14:30", reqs: "57" },
  { user: "M. Jansen", initials: "MJ", client: "cli", ip: "172.16.0.9", status: "Expired", tone: "error", started: "09:12", reqs: "8" },
] as const;

function DataSheet() {
  const [asc, setAsc] = useState(true);
  return (
    <Sheet n="06" title="Data display" intro="Tables, cards, lists and content elements. Machine values (IDs, IPs, timestamps, numbers) are set in Plex Mono.">
      <Section title="Table" desc="40px header, 48px rows, row hover, selectable rows, numbers right-aligned in mono. Wraps in a scroll box on narrow screens.">
        <Table
          caption="Active sessions"
          footer={<><span>1 of 4 selected</span><div className="row" style={{ gap: 8 }}><span className="spec">1–4 of 48</span><Button size="sm" disabled>Previous</Button><Button size="sm">Next</Button></div></>}
        >
          <thead>
            <tr>
              <th style={{ width: 44 }}><Checkbox indeterminate aria-label="Select all" /></th>
              <SortableHeader sort={asc ? "ascending" : "descending"} onSort={() => setAsc(!asc)}>User</SortableHeader>
              <th>Client</th><th>IP address</th><th>Status</th><th>Started</th><th className="fw-num">Requests</th>
              <th style={{ width: 56 }}><VisuallyHidden>Actions</VisuallyHidden></th>
            </tr>
          </thead>
          <tbody>
            {(asc ? sessions : [...sessions].reverse()).map((r) => (
              <tr key={r.user} className={"selected" in r ? "is-selected" : undefined}>
                <td><Checkbox defaultChecked={"selected" in r} aria-label={`Select ${r.user}`} /></td>
                <td><span className="fw-cell-user"><Avatar size="sm">{r.initials}</Avatar>{r.user}</span></td>
                <td className="fw-mono">{r.client}</td>
                <td className="fw-mono">{r.ip}</td>
                <td><Badge tone={r.tone} dot>{r.status}</Badge></td>
                <td className="fw-mono">{r.started}</td>
                <td className="fw-num">{r.reqs}</td>
                <td><Button variant="ghost" iconOnly size="sm" aria-label="Row actions"><Icon name="more_horiz" /></Button></td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Section>
      <Section title="Cards">
        <div className="cols-4">
          <StatCard label="Active users" value="1,284" delta={<Badge tone="success">+4.2%</Badge>} caption="vs previous 7 days" />
          <StatCard label="Failed logins" value="37" delta={<Badge tone="error">+12</Badge>} caption="last 24 hours" />
          <Card style={{ gridColumn: "span 2" }}>
            <CardHeader title="Two-factor authentication" subtitle="Require a one-time code at every sign-in." action={<Switch defaultChecked aria-label="Two-factor authentication" />} />
            <CardBody><span className="fw-t-caption">Applies to all members of the <code>buunk</code> realm.</span></CardBody>
            <CardFooter><Button variant="ghost" size="sm">Learn more</Button><Button size="sm">Configure</Button></CardFooter>
          </Card>
        </div>
      </Section>
      <div className="cols-3">
        <Section title="List">
          <List>
            <ListItem leading={<Avatar online>JB</Avatar>} title="Jurre Buunk" meta="jurre@buunk.org" trailing={<Badge tone="accent">Owner</Badge>} />
            <ListItem leading={<Avatar>AK</Avatar>} title="A. Kramer" meta="a.kramer@buunk.org" trailing={<Badge>Editor</Badge>} />
            <ListItem leading={<Avatar>SV</Avatar>} title="S. de Vries" meta="Invite pending" trailing={<Button variant="ghost" size="sm">Resend</Button>} />
          </List>
        </Section>
        <Section title="Description list">
          <DescriptionList items={[
            { term: "Realm", value: "buunk", mono: true },
            { term: "Client ID", value: "dashboard-web", mono: true },
            { term: "Redirect URI", value: "https://dash.buunk.org/*", mono: true },
            { term: "Status", value: <Badge tone="success" dot>Enabled</Badge> },
          ]} />
        </Section>
        <Section title="Avatar">
          <div className="row">
            <Avatar size="sm">JB</Avatar><Avatar>JB</Avatar><Avatar size="lg">JB</Avatar>
            <Avatar size="lg" square aria-label="Project">BO</Avatar><Avatar size="lg" online>JB</Avatar>
          </div>
          <AvatarGroup><Avatar>JB</Avatar><Avatar>AK</Avatar><Avatar>SV</Avatar><Avatar style={{ fontFamily: "var(--fw-mono)", fontSize: 11, color: "var(--fw-muted)" }}>+5</Avatar></AvatarGroup>
        </Section>
      </div>
      <div className="cols-2">
        <Section title="Accordion">
          <Accordion>
            <AccordionItem title="What is a realm?" open>A realm manages a set of users, credentials, roles and groups. Each user belongs to exactly one realm.</AccordionItem>
            <AccordionItem title="How do I rotate client secrets?">Open the client, go to Credentials and choose Regenerate.</AccordionItem>
            <AccordionItem title="Can I bring my own domain?">Yes — add a CNAME pointing to your instance.</AccordionItem>
          </Accordion>
        </Section>
        <Section title="Code & keyboard">
          <CodeBlock>
            <span className="fw-c"># Point your app at the realm</span>{"\n"}
            <span className="fw-k">export</span> KC_URL=<span className="fw-s">"https://auth.buunk.org"</span>{"\n"}
            <span className="fw-k">export</span> KC_REALM=<span className="fw-s">"buunk"</span>
          </CodeBlock>
          <p className="fw-t-body">Run <code>nix flake update</code>, then press <Kbd>⌘</Kbd> <Kbd>Shift</Kbd> <Kbd>P</Kbd> to open the palette.</p>
        </Section>
      </div>
      <div className="cols-3">
        <Section title="Prose lists">
          <ul className="fw-prose"><li>Unordered list item</li><li>Second item with <a href="#">a link</a></li><li>Third item</li></ul>
          <ol className="fw-prose"><li>Create a client</li><li>Set the redirect URI</li><li>Copy the secret</li></ol>
        </Section>
        <Section title="Blockquote">
          <blockquote><p style={{ margin: 0 }}>Quoted text sits on a 2px rule in border-strong, never in accent.</p><cite>— Source name</cite></blockquote>
        </Section>
        <Section title="Divider">
          <Divider />
          <Divider label="or continue with" />
        </Section>
      </div>
    </Sheet>
  );
}

function OverlaySheet() {
  const [dialog, setDialog] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [palette, setPalette] = useState(false);
  const [confirm, setConfirm] = useState("");
  const toast = useToast();
  return (
    <Sheet n="07" title="Overlays" intro={<>Floating layers are the only place shadows appear (<code>--fw-shadow-pop</code>). Dialogs trap focus, close on <Kbd>Esc</Kbd> and return focus to their trigger.</>}>
      <div className="cols-2">
        <Section title="Dialog — destructive confirm">
          <div className="row"><Button variant="danger" onClick={() => setDialog(true)}>Delete project…</Button></div>
          <Dialog
            alert
            open={dialog}
            onClose={() => setDialog(false)}
            title="Delete project?"
            footer={<><Button onClick={() => setDialog(false)}>Cancel</Button><Button variant="danger" disabled={confirm !== "dashboard"} onClick={() => setDialog(false)}>Delete project</Button></>}
          >
            <p style={{ margin: 0 }}>This permanently deletes <strong style={{ color: "var(--fw-heading)", fontWeight: 600 }}>dashboard</strong>, its deployments and environment variables. This can't be undone.</p>
            <Field label={<>Type <code>dashboard</code> to confirm</>}><Input value={confirm} onChange={(e) => setConfirm(e.target.value)} /></Field>
          </Dialog>
        </Section>
        <Section title="Drawer / sheet">
          <div className="row"><Button variant="primary" leadingIcon={<Icon name="add" />} onClick={() => setDrawer(true)}>Invite member</Button></div>
          <Drawer
            open={drawer}
            onClose={() => setDrawer(false)}
            title="Invite member"
            subtitle="They'll get an email from auth.buunk.org."
            footer={<><Button onClick={() => setDrawer(false)}>Cancel</Button><Button variant="primary" onClick={() => setDrawer(false)}>Send invite</Button></>}
          >
            <Field label="Email"><Input placeholder="name@company.com" /></Field>
            <Field label="Role"><Select><option>Editor</option><option>Viewer</option><option>Admin</option></Select></Field>
          </Drawer>
        </Section>
      </div>
      <div className="cols-2">
        <Section title="Popover" desc="Non-modal, anchored 8px from its trigger. Closes on outside click.">
          <div style={{ minHeight: 140 }}>
            <Popover label="Share project" trigger={<Button size="sm">Share</Button>}>
              <span className="fw-t-label">Share link</span>
              <InputGroup>
                <Input size="sm" mono defaultValue="dash.buunk.org/p/7f3a91" readOnly aria-label="Share link" style={{ fontSize: 12 }} />
                <Button variant="ghost" size="sm" style={{ marginRight: 3, height: 28 }}>Copy</Button>
              </InputGroup>
              <Switch label="Anyone with the link can view" style={{ fontSize: 13 }} />
            </Popover>
          </div>
        </Section>
        <Section title="Command palette" desc="Opened with ⌘K. Combobox + listbox; arrows move, ↵ runs.">
          <div className="row"><Button leadingIcon={<Icon name="search" />} onClick={() => setPalette(true)}>Open palette <Kbd>⌘K</Kbd></Button></div>
          <CommandPalette
            open={palette}
            onClose={() => setPalette(false)}
            onOpenShortcut={() => setPalette(true)}
            commands={[
              { id: "deploy", group: "Actions", label: "Deploy dashboard", icon: <Icon name="arrow_forward" />, onSelect: () => toast.show({ title: "Deploying dashboard" }) },
              { id: "logs", group: "Actions", label: "View deployment logs", icon: <Icon name="list" />, onSelect: () => {} },
              { id: "deployments", group: "Navigate", label: "Deployments", icon: <Icon name="folder" />, shortcut: "G D", onSelect: () => {} },
              { id: "settings", group: "Navigate", label: "Settings", icon: <Icon name="settings" />, shortcut: "G S", onSelect: () => {} },
            ]}
          />
        </Section>
      </div>
    </Sheet>
  );
}

function App() {
  const [mode, setMode] = useState<ThemeMode>(() => (new URLSearchParams(location.search).get("mode") as ThemeMode) ?? "dark");
  return (
    <FlatworkRoot mode={mode}>
      <ToastProvider>
        <div style={{ position: "fixed", top: 16, right: 16, zIndex: 40 }}>
          <SegmentedControl label="Colour mode" value={mode} onValueChange={(m) => setMode(m as ThemeMode)} options={[{ value: "dark", label: "Dark" }, { value: "light", label: "Light" }, { value: "system", label: "System" }]} />
        </div>
        <Foundations />
        <Buttons />
        <Forms />
        <FeedbackSheet />
        <NavigationSheet />
        <DataSheet />
        <OverlaySheet />
      </ToastProvider>
    </FlatworkRoot>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
