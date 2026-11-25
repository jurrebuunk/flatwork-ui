import { forwardRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type HTMLAttributes, type ReactNode } from "react";
import { cx } from "./cx";
import { Spinner } from "./base";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "link";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonOwnProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Square icon-only button. Always pass an aria-label. */
  iconOnly?: boolean;
  /** Full width. */
  block?: boolean;
  /** Shows a spinner, sets aria-busy and disables the button. */
  loading?: boolean;
  /** Icon before the label. */
  leadingIcon?: ReactNode;
  /** Icon after the label (chevrons for menus, arrows for navigation). */
  trailingIcon?: ReactNode;
}

export type ButtonProps = ButtonOwnProps & ButtonHTMLAttributes<HTMLButtonElement>;
export type ButtonLinkProps = ButtonOwnProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

function buttonClass({ variant = "secondary", size = "md", iconOnly, block }: ButtonOwnProps, className?: string) {
  return cx(
    "fw-btn",
    `fw-btn-${variant}`,
    size !== "md" && `fw-btn-${size}`,
    iconOnly && "fw-btn-icon",
    block && "fw-btn-block",
    className,
  );
}

function content({ loading, leadingIcon, trailingIcon }: ButtonOwnProps, children: ReactNode) {
  return (
    <>
      {loading ? <Spinner /> : leadingIcon}
      {children}
      {trailingIcon}
    </>
  );
}

/**
 * One primary action per view. Secondary for everything else, ghost inside
 * toolbars and menus, danger only for destructive confirmation.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant, size, iconOnly, block, loading, leadingIcon, trailingIcon, className, children, type = "button", disabled, ...props },
  ref,
) {
  const own = { variant, size, iconOnly, block, loading, leadingIcon, trailingIcon };
  return (
    <button
      ref={ref}
      type={type}
      className={buttonClass(own, className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {content(own, children)}
    </button>
  );
});

/** A link styled as a button. */
export const ButtonLink = forwardRef<HTMLAnchorElement, ButtonLinkProps>(function ButtonLink(
  { variant, size, iconOnly, block, loading, leadingIcon, trailingIcon, className, children, ...props },
  ref,
) {
  const own = { variant, size, iconOnly, block, loading, leadingIcon, trailingIcon };
  return (
    <a ref={ref} className={buttonClass(own, className)} {...props}>
      {content(own, children)}
    </a>
  );
});

/** Joined secondary buttons for related actions. */
export function ButtonGroup({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div role="group" className={cx("fw-btn-group", className)} {...props} />;
}
