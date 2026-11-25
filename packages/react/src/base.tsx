import { forwardRef, type ElementType, type HTMLAttributes, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { cx } from "./cx";

export type ThemeMode = "dark" | "light" | "system";

export interface FlatworkRootProps extends HTMLAttributes<HTMLDivElement> {
  /** Colour mode. "system" follows prefers-color-scheme. Defaults to the theme's default (dark). */
  mode?: ThemeMode;
}

/**
 * The root every flatwork component must render inside: it carries the tokens,
 * base font and colours. Wrap your app (or one region of it) once.
 */
export const FlatworkRoot = forwardRef<HTMLDivElement, FlatworkRootProps>(function FlatworkRoot(
  { mode, className, ...props },
  ref,
) {
  return <div ref={ref} className={cx("fw", className)} data-theme={mode} {...props} />;
});

type TextVariant = "display" | "title" | "heading" | "body" | "label" | "caption" | "mono";

const defaultTag: Record<TextVariant, ElementType> = {
  display: "h1",
  title: "h2",
  heading: "h3",
  body: "p",
  label: "span",
  caption: "span",
  mono: "span",
};

export type TextProps<T extends ElementType = "p"> = {
  variant?: TextVariant;
  muted?: boolean;
  as?: T;
} & Omit<ComponentPropsWithoutRef<T>, "as">;

/** The type scale: display, title, heading, body, label, caption and mono. */
export function Text<T extends ElementType = "p">({ variant = "body", muted, as, className, ...props }: TextProps<T>) {
  const Tag: ElementType = as ?? defaultTag[variant];
  return <Tag className={cx(`fw-t-${variant}`, muted && "fw-t-muted", className)} {...props} />;
}

/** Keyboard key: <Kbd>⌘</Kbd> <Kbd>K</Kbd>. */
export function Kbd(props: HTMLAttributes<HTMLElement>) {
  return <kbd {...props} />;
}

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  size?: "md" | "lg";
  /** Accessible label. Omit when the spinner sits next to visible text. */
  label?: string;
}

export function Spinner({ size = "md", label, className, ...props }: SpinnerProps) {
  return (
    <span
      className={cx("fw-spinner", size === "lg" && "fw-spinner-lg", className)}
      {...(label ? { role: "status", "aria-label": label } : { "aria-hidden": true })}
      {...props}
    />
  );
}

/** Visually hidden text for screen readers. */
export function VisuallyHidden({ children }: { children: ReactNode }) {
  return (
    <span style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)", whiteSpace: "nowrap" }}>
      {children}
    </span>
  );
}
