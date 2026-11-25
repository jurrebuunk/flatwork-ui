import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cx } from "./cx";
import { Button } from "./Button";
import { IconCheckCircle, IconError, IconInfo, IconWarning, IconX } from "./icons";

export type Tone = "info" | "success" | "warning" | "error" | "neutral";

const toneIcon: Record<Tone, ReactNode> = {
  info: <IconInfo />,
  success: <IconCheckCircle />,
  warning: <IconWarning />,
  error: <IconError />,
  neutral: <IconInfo />,
};

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  tone?: Tone;
  title?: ReactNode;
  /** Replaces the tone's icon; pass null for none. */
  icon?: ReactNode;
  /** Shows a dismiss button. */
  onDismiss?: () => void;
}

/** Inline, persistent message inside the content flow. Errors use role="alert". */
export function Alert({ tone = "info", title, icon, onDismiss, className, children, ...props }: AlertProps) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cx("fw-alert", tone !== "info" && `fw-alert-${tone}`, className)}
      {...props}
    >
      {icon === undefined ? toneIcon[tone] : icon}
      <div className="fw-alert-body">
        {title && <span className="fw-alert-title">{title}</span>}
        {children && <span className="fw-alert-text">{children}</span>}
      </div>
      {onDismiss && (
        <Button variant="ghost" size="sm" iconOnly aria-label="Dismiss" onClick={onDismiss} style={{ margin: "-6px -6px 0 0", color: "inherit" }}>
          <IconX />
        </Button>
      )}
    </div>
  );
}

export interface ToastProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  tone?: Tone;
  title: ReactNode;
  description?: ReactNode;
  /** Text buttons under the message (Undo, Retry). */
  actions?: ReactNode;
  onDismiss?: () => void;
}

export function Toast({ tone = "success", title, description, actions, onDismiss, className, ...props }: ToastProps) {
  return (
    <div role={tone === "error" ? "alert" : "status"} className={cx("fw-toast", className)} {...props}>
      <span style={{ color: `var(--fw-${tone === "neutral" ? "muted" : tone})`, display: "contents" }}>{toneIcon[tone]}</span>
      <div className="fw-alert-body">
        <span className="fw-alert-title">{title}</span>
        {description && <span>{description}</span>}
        {actions && <div className="fw-toast-actions">{actions}</div>}
      </div>
      {onDismiss && (
        <Button variant="ghost" size="sm" iconOnly aria-label="Dismiss" onClick={onDismiss} style={{ margin: "-6px -8px 0 0" }}>
          <IconX />
        </Button>
      )}
    </div>
  );
}

export interface ToastOptions extends Omit<ToastProps, "onDismiss"> {
  /** Milliseconds before it disappears; errors stay until dismissed. Default 5000. */
  duration?: number;
}

interface ToastApi {
  show: (toast: ToastOptions) => string;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

/** Renders the bottom-right toast stack. Put it inside <FlatworkRoot>. */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Array<ToastOptions & { id: string }>>([]);
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>());
  const dismiss = useCallback((id: string) => {
    clearTimeout(timers.current.get(id));
    timers.current.delete(id);
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);
  const show = useCallback(
    (toast: ToastOptions) => {
      const id = Math.random().toString(36).slice(2);
      setToasts((list) => [...list, { ...toast, id }]);
      const duration = toast.duration ?? (toast.tone === "error" ? Infinity : 5000);
      if (Number.isFinite(duration)) timers.current.set(id, setTimeout(() => dismiss(id), duration));
      return id;
    },
    [dismiss],
  );
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const api = useMemo(() => ({ show, dismiss }), [show, dismiss]);
  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="fw-toaster" aria-live="polite">
        {toasts.map(({ id, duration: _duration, ...toast }) => (
          <Toast key={id} {...toast} onDismiss={() => dismiss(id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/** `const toast = useToast(); toast.show({ title: "Changes saved" })` */
export function useToast(): ToastApi {
  const api = useContext(ToastContext);
  if (!api) throw new Error("useToast must be used inside <ToastProvider>");
  return api;
}

export type BadgeTone = "neutral" | "accent" | "success" | "warning" | "error";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  /** Leading status dot. */
  dot?: boolean;
  /** Round accent counter (3, 99+). */
  count?: boolean;
}

/** Read-only status. */
export function Badge({ tone = "neutral", dot, count, className, children, ...props }: BadgeProps) {
  return (
    <span className={cx("fw-badge", tone !== "neutral" && `fw-badge-${tone}`, count && "fw-badge-count", className)} {...props}>
      {dot && <span className="fw-dot" />}
      {children}
    </span>
  );
}

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  onRemove?: () => void;
  /** Accessible name for the remove button. Defaults to "Remove <text>". */
  removeLabel?: string;
}

/** User-editable, removable token. */
export function Tag({ onRemove, removeLabel, className, children, ...props }: TagProps) {
  return (
    <span className={cx("fw-tag", className)} {...props}>
      {children}
      {onRemove && (
        <button type="button" aria-label={removeLabel ?? (typeof children === "string" ? `Remove ${children}` : "Remove")} onClick={onRemove}>
          <IconX />
        </button>
      )}
    </span>
  );
}

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  /** 0–max. Omit for an indeterminate bar. */
  value?: number;
  max?: number;
  tone?: "accent" | "success" | "warning" | "error";
  /** A measurement (storage, strength) instead of task progress. */
  meter?: boolean;
}

export function Progress({ value, max = 100, tone = "accent", meter, className, ...props }: ProgressProps) {
  const indeterminate = value === undefined;
  const pct = indeterminate ? undefined : Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div
      role={meter ? "meter" : "progressbar"}
      aria-valuenow={value}
      aria-valuemin={indeterminate ? undefined : 0}
      aria-valuemax={indeterminate ? undefined : max}
      className={cx("fw-progress", indeterminate && "fw-progress-indeterminate", tone !== "accent" && `is-${tone}`, className)}
      {...props}
    >
      <span style={pct === undefined ? undefined : { width: `${pct}%` }} />
    </div>
  );
}

export interface SkeletonProps extends HTMLAttributes<HTMLSpanElement> {
  width?: CSSProperties["width"];
  height?: CSSProperties["height"];
  circle?: boolean;
}

/** Loading placeholder in the shape of the content. */
export function Skeleton({ width, height = 12, circle, className, style, ...props }: SkeletonProps) {
  return (
    <span
      aria-hidden="true"
      className={cx("fw-skeleton", className)}
      style={{ display: "block", width, height, ...(circle && { borderRadius: "50%" }), ...style }}
      {...props}
    />
  );
}

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  /** Usually one small primary button. */
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action, className, ...props }: EmptyStateProps) {
  return (
    <div className={cx("fw-empty", className)} {...props}>
      {icon && <span className="fw-empty-icon">{icon}</span>}
      <span className="fw-t-heading">{title}</span>
      {description && (
        <span className="fw-t-caption" style={{ maxWidth: 260 }}>
          {description}
        </span>
      )}
      {action && <div style={{ marginTop: 8 }}>{action}</div>}
    </div>
  );
}
