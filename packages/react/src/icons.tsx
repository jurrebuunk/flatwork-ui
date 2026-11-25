import type { HTMLAttributes } from "react";
import { cx } from "./cx";
import type { IconName } from "./icon-names";

export type { IconName } from "./icon-names";

export interface IconProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  /** Any Material Symbols name, e.g. "search", "settings", "arrow_forward". Browse: https://fonts.google.com/icons */
  name: IconName;
  /** Filled style, for active or selected states. */
  filled?: boolean;
  /** Pixel size. Defaults to the component's (18px standalone). */
  size?: number;
  /** Accessible name. Omit for decorative icons next to text (they are hidden from screen readers). */
  label?: string;
}

/** Material Symbols Rounded icon, set in the theme's icon font. */
export function Icon({ name, filled, size, label, className, style, ...props }: IconProps) {
  return (
    <span
      className={cx("fw-icon", filled && "is-filled", className)}
      style={size ? { fontSize: size, ...style } : style}
      {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}
      translate="no"
      {...props}
    >
      {name}
    </span>
  );
}
