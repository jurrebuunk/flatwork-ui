import {
  createContext,
  Fragment,
  useContext,
  useId,
  useState,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type ComponentPropsWithoutRef,
  type ElementType,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { cx } from "./cx";
import { Icon } from "./icons";


/** Moves focus between sibling elements matching `selector` with arrow keys. */
function rovingKeys(selector: string, orientation: "horizontal" | "vertical" = "horizontal") {
  return (e: KeyboardEvent<HTMLElement>) => {
    const [prev, next] = orientation === "horizontal" ? ["ArrowLeft", "ArrowRight"] : ["ArrowUp", "ArrowDown"];
    if (![prev, next, "Home", "End"].includes(e.key)) return;
    const items = [...e.currentTarget.querySelectorAll<HTMLElement>(selector)].filter((el) => !el.hasAttribute("disabled"));
    const i = items.indexOf(document.activeElement as HTMLElement);
    const target = e.key === "Home" ? 0 : e.key === "End" ? items.length - 1 : (i + (e.key === next ? 1 : -1) + items.length) % items.length;
    e.preventDefault();
    items[target]?.focus();
    items[target]?.click();
  };
}

// ---------- Top bar & side nav ----------

export interface TopNavProps extends HTMLAttributes<HTMLElement> {
  /** Logo and product name, usually a link home. */
  brand?: ReactNode;
  /** Right side: search, notifications, avatar. */
  end?: ReactNode;
  /** Accessible name for the primary nav. */
  navLabel?: string;
}

/** App top bar. Put plain links (or your router's links) as children; mark the current one with aria-current="page". */
export function TopNav({ brand, end, navLabel = "Primary", className, children, ...props }: TopNavProps) {
  return (
    <header className={cx("fw-topnav", className)} {...props}>
      {brand}
      {children && <nav aria-label={navLabel}>{children}</nav>}
      {end && <div className="fw-end">{end}</div>}
    </header>
  );
}

export interface BrandProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** The square accent mark; usually a 14px icon or a letter. */
  mark?: ReactNode;
}

export function Brand({ mark, className, children, style, ...props }: BrandProps) {
  return (
    <a className={cx("fw-brand", className)} style={{ textDecoration: "none", ...style }} {...props}>
      {mark && (
        <span className="fw-logo-mark" aria-hidden="true">
          {mark}
        </span>
      )}
      {children}
    </a>
  );
}

export function SideNav({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return <nav className={cx("fw-sidenav", className)} {...props} />;
}

export function NavGroupLabel({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={cx("fw-group-label", className)} {...props} />;
}

export type NavItemProps<T extends ElementType = "a"> = {
  icon?: ReactNode;
  /** Right-aligned badge or count. */
  badge?: ReactNode;
  current?: boolean;
  /** Your router's link component, e.g. Next.js Link. Default <a>. */
  as?: T;
} & Omit<ComponentPropsWithoutRef<T>, "as">;

export function NavItem<T extends ElementType = "a">({ icon, badge, current, as, className, children, ...props }: NavItemProps<T>) {
  const Tag: ElementType = as ?? "a";
  return (
    <Tag className={cx("fw-nav-item", className)} aria-current={current ? "page" : undefined} {...props}>
      {icon}
      {children}
      {badge}
    </Tag>
  );
}

// ---------- Tabs ----------

interface TabsContextValue {
  value: string;
  setValue: (v: string) => void;
  baseId: string;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabs() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("Tab components must be used inside <Tabs>");
  return ctx;
}

export interface TabsProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children: ReactNode;
}

/** Tabs state. Contains a <TabList> and <TabPanel>s. */
export function Tabs({ value: controlled, defaultValue = "", onValueChange, children }: TabsProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const baseId = useId();
  const value = controlled ?? uncontrolled;
  const setValue = (v: string) => {
    setUncontrolled(v);
    onValueChange?.(v);
  };
  return <TabsContext.Provider value={{ value, setValue, baseId }}>{children}</TabsContext.Provider>;
}

export function TabList({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div role="tablist" className={cx("fw-tabs", className)} onKeyDown={rovingKeys('[role="tab"]')} {...props} />;
}

export interface TabProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value"> {
  value: string;
  /** Count after the label. */
  badge?: ReactNode;
}

export function Tab({ value, badge, className, children, ...props }: TabProps) {
  const tabs = useTabs();
  const selected = tabs.value === value;
  return (
    <button
      type="button"
      role="tab"
      id={`${tabs.baseId}-tab-${value}`}
      aria-selected={selected}
      aria-controls={`${tabs.baseId}-panel-${value}`}
      tabIndex={selected ? 0 : -1}
      className={cx("fw-tab", selected && "is-active", className)}
      onClick={() => tabs.setValue(value)}
      {...props}
    >
      {children}
      {badge}
    </button>
  );
}

export function TabPanel({ value, ...props }: HTMLAttributes<HTMLDivElement> & { value: string }) {
  const tabs = useTabs();
  if (tabs.value !== value) return null;
  return <div role="tabpanel" id={`${tabs.baseId}-panel-${value}`} aria-labelledby={`${tabs.baseId}-tab-${value}`} tabIndex={0} {...props} />;
}

// ---------- Segmented ----------

export interface SegmentedOption {
  value: string;
  label: ReactNode;
  icon?: ReactNode;
  /** Required when the option is icon-only. */
  ariaLabel?: string;
}

export interface SegmentedControlProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  options: SegmentedOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Accessible name of the group. */
  label: string;
}

/** Switches between views of the same data (Day / Week / Month, grid / list). */
export function SegmentedControl({ options, value: controlled, defaultValue, onValueChange, label, className, ...props }: SegmentedControlProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue ?? options[0]?.value);
  const value = controlled ?? uncontrolled;
  return (
    <div role="radiogroup" aria-label={label} className={cx("fw-segmented", className)} onKeyDown={rovingKeys('[role="radio"]')} {...props}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={o.value === value}
          aria-label={o.ariaLabel}
          tabIndex={o.value === value ? 0 : -1}
          className={cx("fw-seg", o.value === value && "is-active")}
          onClick={() => {
            setUncontrolled(o.value);
            onValueChange?.(o.value);
          }}
        >
          {o.icon}
          {o.label}
        </button>
      ))}
    </div>
  );
}

// ---------- Breadcrumb, pagination, stepper ----------

export interface Crumb {
  label: ReactNode;
  href?: string;
}

export interface BreadcrumbProps extends HTMLAttributes<HTMLElement> {
  items: Crumb[];
  /** Render links with your router. Default <a href>. */
  renderLink?: (crumb: Crumb) => ReactNode;
}

/** The last item is the current page. */
export function Breadcrumb({ items, renderLink, className, ...props }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={className} {...props}>
      <ol className="fw-breadcrumb">
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <Fragment key={i}>
              <li>{last ? <span aria-current="page">{c.label}</span> : renderLink ? renderLink(c) : <a href={c.href}>{c.label}</a>}</li>
              {!last && (
                <li aria-hidden="true">
                  <Icon name="chevron_right" className="fw-sep" />
                </li>
              )}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}

/** Page numbers to show: always first, last and the current ±1, with "…" gaps. */
export function pageRange(page: number, count: number): Array<number | "gap"> {
  const pages = new Set([1, count, page - 1, page, page + 1].filter((p) => p >= 1 && p <= count));
  const sorted = [...pages].sort((a, b) => a - b);
  const out: Array<number | "gap"> = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) out.push("gap");
    out.push(p);
  });
  return out;
}

export interface PaginationProps extends Omit<HTMLAttributes<HTMLElement>, "onChange"> {
  page: number;
  count: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, count, onPageChange, className, ...props }: PaginationProps) {
  return (
    <nav aria-label="Pagination" className={className} {...props}>
      <ul className="fw-pagination">
        <li>
          <button className="fw-page" type="button" aria-label="Previous page" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
            <Icon name="chevron_left" />
          </button>
        </li>
        {pageRange(page, count).map((p, i) =>
          p === "gap" ? (
            <li key={`gap-${i}`}>
              <span className="fw-page" aria-hidden="true" style={{ cursor: "default" }}>
                …
              </span>
            </li>
          ) : (
            <li key={p}>
              <button
                type="button"
                className={cx("fw-page", p === page && "is-active")}
                aria-current={p === page ? "page" : undefined}
                onClick={() => onPageChange(p)}
              >
                {p}
              </button>
            </li>
          ),
        )}
        <li>
          <button className="fw-page" type="button" aria-label="Next page" disabled={page >= count} onClick={() => onPageChange(page + 1)}>
            <Icon name="chevron_right" />
          </button>
        </li>
      </ul>
    </nav>
  );
}

export interface StepperProps extends HTMLAttributes<HTMLOListElement> {
  steps: ReactNode[];
  /** Index of the current step; earlier steps show as done. */
  current: number;
}

export function Stepper({ steps, current, className, ...props }: StepperProps) {
  return (
    <ol className={cx("fw-stepper", className)} {...props}>
      {steps.map((label, i) => (
        <Fragment key={i}>
          {i > 0 && <li className="fw-step-line" aria-hidden="true" />}
          <li className={cx("fw-step", i < current && "is-done", i === current && "is-active")} aria-current={i === current ? "step" : undefined}>
            <span className="fw-step-n">{i < current ? <Icon name="check" /> : i + 1}</span>
            {label}
          </li>
        </Fragment>
      ))}
    </ol>
  );
}
