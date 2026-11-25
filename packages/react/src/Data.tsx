import { Fragment, type DetailsHTMLAttributes, type HTMLAttributes, type ReactNode, type TableHTMLAttributes, type ThHTMLAttributes } from "react";
import { cx } from "./cx";
import { Icon } from "./icons";


// ---------- Card ----------

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx("fw-card", className)} {...props} />;
}

export interface CardHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title?: ReactNode;
  subtitle?: ReactNode;
  /** Right side: a badge, switch or button. */
  action?: ReactNode;
}

export function CardHeader({ title, subtitle, action, className, children, ...props }: CardHeaderProps) {
  return (
    <div className={cx("fw-card-head", className)} {...props}>
      {children ?? (
        <div>
          {title && <h3 className="fw-card-title">{title}</h3>}
          {subtitle && <p className="fw-card-sub">{subtitle}</p>}
        </div>
      )}
      {action}
    </div>
  );
}

export function CardBody({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx("fw-card-body", className)} {...props} />;
}

export function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx("fw-card-foot", className)} {...props} />;
}

export interface StatCardProps extends HTMLAttributes<HTMLDivElement> {
  label: ReactNode;
  value: ReactNode;
  /** Change indicator, usually a <Badge>. */
  delta?: ReactNode;
  caption?: ReactNode;
}

/** A metric: label, big mono value, change badge and context. */
export function StatCard({ label, value, delta, caption, ...props }: StatCardProps) {
  return (
    <Card {...props}>
      <CardHeader>
        <span className="fw-t-caption">{label}</span>
        {delta}
      </CardHeader>
      <CardBody>
        <span className="fw-stat-value">{value}</span>
        {caption && <span className="fw-t-caption">{caption}</span>}
      </CardBody>
    </Card>
  );
}

// ---------- Table ----------

export interface TableProps extends TableHTMLAttributes<HTMLTableElement> {
  caption?: ReactNode;
  /** Footer bar under the table: selection count, pagination. */
  footer?: ReactNode;
}

/**
 * 40px header, 48px rows, row hover. Write <thead>/<tbody> yourself; use
 * className="fw-num" for right-aligned mono numbers, "fw-mono" for IDs and IPs,
 * and "is-selected" on selected rows.
 */
export function Table({ caption, footer, className, children, ...props }: TableProps) {
  return (
    <div className="fw-table-wrap">
      <table className={cx("fw-table", className)} {...props}>
        {caption && <caption>{caption}</caption>}
        {children}
      </table>
      {footer && <div className="fw-table-foot">{footer}</div>}
    </div>
  );
}

export interface SortableHeaderProps extends ThHTMLAttributes<HTMLTableCellElement> {
  sort?: "ascending" | "descending" | "none";
  onSort?: () => void;
}

export function SortableHeader({ sort = "none", onSort, className, children, ...props }: SortableHeaderProps) {
  return (
    <th className={cx("fw-sortable", className)} aria-sort={sort} {...props}>
      <button type="button" onClick={onSort} style={{ background: "none", border: 0, padding: 0, font: "inherit", color: "inherit", cursor: "pointer" }}>
        {children}
        {sort === "descending" ? <Icon name="keyboard_arrow_down" /> : <Icon name="keyboard_arrow_up" style={sort === "none" ? { opacity: 0.4 } : undefined} />}
      </button>
    </th>
  );
}

// ---------- Lists ----------

export function List({ className, ...props }: HTMLAttributes<HTMLUListElement>) {
  return <ul className={cx("fw-list", className)} {...props} />;
}

export interface ListItemProps extends Omit<HTMLAttributes<HTMLLIElement>, "title"> {
  leading?: ReactNode;
  title: ReactNode;
  meta?: ReactNode;
  trailing?: ReactNode;
}

export function ListItem({ leading, title, meta, trailing, ...props }: ListItemProps) {
  return (
    <li {...props}>
      {leading}
      <span className="fw-grow">
        <span className="fw-title">{title}</span>
        {meta && <span className="fw-meta">{meta}</span>}
      </span>
      {trailing}
    </li>
  );
}

export interface DescriptionListProps extends HTMLAttributes<HTMLDListElement> {
  items: Array<{ term: ReactNode; value: ReactNode; mono?: boolean }>;
}

/** Key/value details. Mark machine values `mono`. */
export function DescriptionList({ items, className, ...props }: DescriptionListProps) {
  return (
    <dl className={cx("fw-dl", className)} {...props}>
      {items.map((it, i) => (
        <Fragment key={i}>
          <dt>{it.term}</dt>
          <dd className={it.mono ? "fw-mono" : undefined}>{it.value}</dd>
        </Fragment>
      ))}
    </dl>
  );
}

export function Accordion({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx("fw-accordion", className)} {...props} />;
}

export interface AccordionItemProps extends Omit<DetailsHTMLAttributes<HTMLDetailsElement>, "title"> {
  title: ReactNode;
}

export function AccordionItem({ title, children, ...props }: AccordionItemProps) {
  return (
    <details {...props}>
      <summary>
        {title}
        <Icon name="keyboard_arrow_down" />
      </summary>
      <div className="fw-acc-body">{children}</div>
    </details>
  );
}

export function CodeBlock({ className, ...props }: HTMLAttributes<HTMLPreElement>) {
  return <pre className={cx("fw-code-block", className)} {...props} />;
}

export function Divider({ label }: { label?: ReactNode }) {
  if (!label) return <hr />;
  const line = <span style={{ flex: 1, height: 1, background: "var(--fw-border)" }} />;
  return (
    <div role="separator" style={{ display: "flex", alignItems: "center", gap: 12, color: "var(--fw-muted)", fontSize: 12 }}>
      {line}
      {label}
      {line}
    </div>
  );
}

// ---------- Avatar ----------

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  /** Initials or an <img>. */
  children: ReactNode;
  size?: "sm" | "md" | "lg";
  /** Square, for projects and organisations. */
  square?: boolean;
  /** Green online dot. */
  online?: boolean;
}

export function Avatar({ size = "md", square, online, className, ...props }: AvatarProps) {
  return <span className={cx("fw-avatar", size !== "md" && `fw-avatar-${size}`, square && "fw-avatar-sq", online && "fw-presence", className)} {...props} />;
}

export function AvatarGroup({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx("fw-avatar-group", className)} {...props} />;
}
