import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  type CSSProperties,
  type FieldsetHTMLAttributes,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import { cx } from "./cx";
import { Icon } from "./icons";


interface FieldContextValue {
  id: string;
  describedBy?: string;
  invalid: boolean;
}

const FieldContext = createContext<FieldContextValue | null>(null);

/** Props a control takes from its surrounding <Field>. Explicit props win. */
function useFieldProps(props: { id?: string; "aria-describedby"?: string; "aria-invalid"?: unknown; invalid?: boolean }) {
  const field = useContext(FieldContext);
  const invalid = props.invalid ?? field?.invalid ?? false;
  return {
    id: props.id ?? field?.id,
    "aria-describedby": props["aria-describedby"] ?? field?.describedBy,
    "aria-invalid": (props["aria-invalid"] as boolean | undefined) ?? (invalid || undefined),
    invalid,
  };
}

export interface FieldProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  label: ReactNode;
  /** Adds a muted "(optional)" to the label. */
  optional?: boolean;
  /** Help text below the control. Replaced by `error` when set. */
  help?: ReactNode;
  /** Error message; also marks the control aria-invalid. */
  error?: ReactNode;
  /** Something to the right of the label (a value, a counter). */
  labelEnd?: ReactNode;
  /** Set when the control is not a labelable element (a dropzone, a group); renders the label as text. */
  labelAsText?: boolean;
  id?: string;
  children: ReactNode;
}

/**
 * Every control sits in a field: label above, control, then help or error text.
 * Labels are always visible; placeholders are examples, not labels.
 */
export function Field({ label, optional, help, error, labelEnd, labelAsText, id, className, children, ...props }: FieldProps) {
  const autoId = useId();
  const controlId = id ?? autoId;
  const messageId = `${controlId}-message`;
  const message = error ?? help;
  const labelEl = labelAsText ? (
    <span className="fw-label">{label}</span>
  ) : (
    <label className="fw-label" htmlFor={controlId}>
      {label}
      {optional && <span className="fw-opt"> (optional)</span>}
    </label>
  );
  return (
    <FieldContext.Provider value={{ id: controlId, describedBy: message ? messageId : undefined, invalid: Boolean(error) }}>
      <div className={cx("fw-field", className)} {...props}>
        {labelEnd ? (
          <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
            {labelEl}
            {labelEnd}
          </div>
        ) : (
          labelEl
        )}
        {children}
        {error ? (
          <span className="fw-field-error" id={messageId}>
            {error}
          </span>
        ) : help ? (
          <span className="fw-help" id={messageId}>
            {help}
          </span>
        ) : null}
      </div>
    </FieldContext.Provider>
  );
}

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  size?: "sm" | "md";
  invalid?: boolean;
  /** Set in Plex Mono, for machine values (IDs, hosts, ports, dates). */
  mono?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { size = "md", invalid: _invalid, mono, className, ...props },
  ref,
) {
  const { invalid, ...field } = useFieldProps({ ...props, invalid: _invalid });
  return (
    <input
      ref={ref}
      className={cx("fw-input", size === "sm" && "fw-input-sm", invalid && "is-error", mono && "is-mono", className)}
      {...props}
      {...field}
    />
  );
});

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { invalid: _invalid, className, ...props },
  ref,
) {
  const { invalid, ...field } = useFieldProps({ ...props, invalid: _invalid });
  return <textarea ref={ref} className={cx("fw-textarea", invalid && "is-error", className)} {...props} {...field} />;
});

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean;
}

/** Native select with the flatwork chevron. */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { invalid: _invalid, className, children, ...props },
  ref,
) {
  const { invalid, ...field } = useFieldProps({ ...props, invalid: _invalid });
  return (
    <span className="fw-select-wrap">
      <select ref={ref} className={cx("fw-select", invalid && "is-error", className)} {...props} {...field}>
        {children}
      </select>
      <Icon name="keyboard_arrow_down" />
    </span>
  );
});

/**
 * An input with things attached: icons, prefixes like https://, suffixes like
 * .buunk.org, or a button. Put an <Input> and <Affix>es inside.
 */
export function InputGroup({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx("fw-input-affix", className)} {...props} />;
}

export interface AffixProps extends HTMLAttributes<HTMLSpanElement> {
  /** Boxed mono affix (https://, .buunk.org, port) instead of a plain icon/hint. */
  boxed?: boolean;
  /** Boxed affix placed after the input. */
  end?: boolean;
}

export function Affix({ boxed, end, className, ...props }: AffixProps) {
  return <span className={cx("fw-affix", boxed && "fw-affix-box", boxed && end && "fw-end", className)} {...props} />;
}

interface ChoiceProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  /** Text next to the control. */
  label?: ReactNode;
  /** Muted second line under the label. */
  description?: ReactNode;
}

function ChoiceLabel({ label, description, children, center, spread, style, className }: {
  label?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  center?: boolean;
  spread?: boolean;
  style?: CSSProperties;
  className?: string;
}) {
  if (label === undefined) return <>{children}</>;
  const text = description ? (
    <span>
      {label}
      <small>{description}</small>
    </span>
  ) : (
    label
  );
  return (
    <label
      className={cx("fw-check", className)}
      style={{ ...(center && { alignItems: "center" }), ...(spread && { justifyContent: "space-between", width: "100%" }), ...style }}
    >
      {spread ? (
        <>
          {text}
          {children}
        </>
      ) : (
        <>
          {children}
          {text}
        </>
      )}
    </label>
  );
}

export interface CheckboxProps extends ChoiceProps {
  indeterminate?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, description, indeterminate, className, style, ...props },
  ref,
) {
  const inner = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => inner.current!);
  useEffect(() => {
    if (inner.current) inner.current.indeterminate = Boolean(indeterminate);
  }, [indeterminate]);
  return (
    <ChoiceLabel label={label} description={description} className={label !== undefined ? className : undefined} style={label !== undefined ? style : undefined}>
      <input
        ref={inner}
        type="checkbox"
        className={cx("fw-checkbox", indeterminate && "is-indeterminate", label === undefined && className)}
        aria-checked={indeterminate ? "mixed" : undefined}
        style={label === undefined ? style : undefined}
        {...props}
      />
    </ChoiceLabel>
  );
});

export const Radio = forwardRef<HTMLInputElement, ChoiceProps>(function Radio({ label, description, className, style, ...props }, ref) {
  return (
    <ChoiceLabel label={label} description={description} className={label !== undefined ? className : undefined} style={label !== undefined ? style : undefined}>
      <input ref={ref} type="radio" className={cx("fw-radio", label === undefined && className)} style={label === undefined ? style : undefined} {...props} />
    </ChoiceLabel>
  );
});

export interface SwitchProps extends ChoiceProps {
  /** Label on the left and switch on the right, full width (settings rows). */
  spread?: boolean;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  { label, description, spread, className, style, ...props },
  ref,
) {
  return (
    <ChoiceLabel label={label} description={description} center spread={spread} className={label !== undefined ? className : undefined} style={label !== undefined ? style : undefined}>
      <input ref={ref} type="checkbox" role="switch" className={cx("fw-switch", label === undefined && className)} style={label === undefined ? style : undefined} {...props} />
    </ChoiceLabel>
  );
});

export interface RangeProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {}

/** Slider. The filled part of the track follows the value. */
export const Range = forwardRef<HTMLInputElement, RangeProps>(function Range(
  { className, style, min = 0, max = 100, value, defaultValue, onChange, ...props },
  ref,
) {
  const field = useFieldProps(props);
  const inner = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => inner.current!);
  const setFill = (el: HTMLInputElement) => {
    const lo = Number(el.min), hi = Number(el.max);
    el.style.setProperty("--fw-fill", `${hi > lo ? ((Number(el.value) - lo) / (hi - lo)) * 100 : 0}%`);
  };
  useEffect(() => {
    if (inner.current) setFill(inner.current);
  }, [value, min, max]);
  return (
    <input
      ref={inner}
      type="range"
      className={cx("fw-range", className)}
      style={style}
      min={min}
      max={max}
      value={value}
      defaultValue={defaultValue}
      onChange={(e) => {
        setFill(e.currentTarget);
        onChange?.(e);
      }}
      {...props}
      id={field.id}
      aria-describedby={field["aria-describedby"]}
    />
  );
});

export interface DropzoneProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "title"> {
  title?: ReactNode;
  hint?: ReactNode;
  /** Called with the dropped or picked files. */
  onFiles?: (files: FileList) => void;
}

/** File upload area: click to pick, or drag and drop. */
export function Dropzone({ title, hint, onFiles, onChange, className, ...props }: DropzoneProps) {
  const field = useFieldProps(props);
  return (
    <label
      className={cx("fw-dropzone", className)}
      style={{ cursor: "pointer", position: "relative" }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        if (e.dataTransfer.files.length) onFiles?.(e.dataTransfer.files);
      }}
    >
      <Icon name="upload" />
      <span>{title ?? <><strong>Click to upload</strong> or drag and drop</>}</span>
      {hint && <span style={{ fontFamily: "var(--fw-mono)", fontSize: 12 }}>{hint}</span>}
      <input
        type="file"
        style={{ position: "absolute", width: 1, height: 1, opacity: 0 }}
        onChange={(e) => {
          if (e.currentTarget.files?.length) onFiles?.(e.currentTarget.files);
          onChange?.(e);
        }}
        {...props}
        id={field.id}
        aria-describedby={field["aria-describedby"]}
      />
    </label>
  );
}

export interface FieldsetProps extends FieldsetHTMLAttributes<HTMLFieldSetElement> {
  legend: ReactNode;
}

/** A bordered group of fields with a legend. */
export function Fieldset({ legend, className, children, ...props }: FieldsetProps) {
  return (
    <fieldset className={cx("fw-fieldset", className)} {...props}>
      <legend>{legend}</legend>
      {children}
    </fieldset>
  );
}
