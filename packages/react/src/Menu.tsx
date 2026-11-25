import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cx } from "./cx";
import { Icon } from "./icons";


/** Floating list of actions or options. Use inside <DropdownMenu>, or on its own with role="listbox". */
export const Menu = forwardRef<HTMLUListElement, HTMLAttributes<HTMLUListElement>>(function Menu({ className, role = "menu", ...props }, ref) {
  return <ul ref={ref} role={role} className={cx("fw-menu", className)} {...props} />;
});

export function MenuLabel({ className, ...props }: HTMLAttributes<HTMLLIElement>) {
  return <li role="presentation" className={cx("fw-menu-label", className)} {...props} />;
}

export function MenuSeparator({ className, ...props }: HTMLAttributes<HTMLLIElement>) {
  return <li role="separator" className={cx("fw-menu-sep", className)} {...props} />;
}

export interface MenuItemProps extends HTMLAttributes<HTMLElement> {
  icon?: ReactNode;
  /** Keyboard shortcut, right-aligned in mono. */
  shortcut?: ReactNode;
  danger?: boolean;
  /** Selected option in a single-choice menu; shows a check. */
  selected?: boolean;
  disabled?: boolean;
  /** "li" for listbox options; default is a <button role="menuitem"> inside an <li>. */
  as?: "button" | "li";
}

export function MenuItem({ icon, shortcut, danger, selected, disabled, as = "button", className, children, ...props }: MenuItemProps) {
  const classes = cx("fw-menu-item", danger && "is-danger", selected && "is-selected", className);
  const inner = (
    <>
      {icon}
      {children}
      {shortcut ? <span className="fw-end">{shortcut}</span> : selected ? <Icon name="check" style={{ marginLeft: "auto", color: "var(--fw-accent)" }} /> : null}
    </>
  );
  if (as === "li") {
    return (
      <li className={classes} aria-disabled={disabled || undefined} {...props}>
        {inner}
      </li>
    );
  }
  return (
    <li role="none">
      <button type="button" role="menuitem" className={classes} disabled={disabled} {...props}>
        {inner}
      </button>
    </li>
  );
}
