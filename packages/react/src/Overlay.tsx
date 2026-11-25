import {
  cloneElement,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type RefObject,
  type SyntheticEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import { cx } from "./cx";
import { Button } from "./Button";
import { IconSearch, IconX } from "./icons";
import { Menu, MenuItem, MenuLabel } from "./Menu";

/** Calls `onOutside` on pointer down outside `ref` and on Escape, while `active`. */
function useDismiss(ref: RefObject<HTMLElement | null>, active: boolean, onOutside: () => void) {
  useEffect(() => {
    if (!active) return;
    const onPointer = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onOutside();
    };
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") onOutside();
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [ref, active, onOutside]);
}

type TriggerElement = ReactElement<Record<string, unknown>>;

export interface TooltipProps {
  /** Short label; never essential information. */
  content: ReactNode;
  /** Optional shortcut shown after the label. */
  shortcut?: string;
  /** A single focusable element, usually an icon button. */
  children: TriggerElement;
  /** Milliseconds before showing. Default 500. */
  delay?: number;
}

/** Inverted label above a trigger, after a 500ms hover or on focus. */
export function Tooltip({ content, shortcut, children, delay = 500 }: TooltipProps) {
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const id = useId();
  const show = (wait: number) => {
    clearTimeout(timer.current);
    if (wait <= 0) setOpen(true);
    else timer.current = setTimeout(() => setOpen(true), wait);
  };
  const hide = () => {
    clearTimeout(timer.current);
    setOpen(false);
  };
  useEffect(() => () => clearTimeout(timer.current), []);
  return (
    <span
      className="fw-anchor"
      onPointerEnter={() => show(delay)}
      onPointerLeave={hide}
      onFocus={() => show(0)}
      onBlur={hide}
      onKeyDown={(e) => e.key === "Escape" && hide()}
    >
      {cloneElement(children, { "aria-describedby": open ? id : undefined })}
      {open && (
        <span className="fw-tooltip" role="tooltip" id={id}>
          {content}
          {shortcut && <kbd>{shortcut}</kbd>}
        </span>
      )}
    </span>
  );
}

export interface PopoverProps extends Omit<HTMLAttributes<HTMLDivElement>, "content"> {
  /** The element that toggles the popover, usually a button. */
  trigger: TriggerElement;
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Align to the trigger's right edge. */
  alignEnd?: boolean;
  /** Accessible name of the popover. */
  label?: string;
}

/** Non-modal panel anchored 8px below its trigger; closes on outside click and Esc. */
export function Popover({ trigger, children, open: controlled, defaultOpen = false, onOpenChange, alignEnd, label, className, ...props }: PopoverProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultOpen);
  const open = controlled ?? uncontrolled;
  const setOpen = (next: boolean) => {
    setUncontrolled(next);
    onOpenChange?.(next);
  };
  const ref = useRef<HTMLSpanElement>(null);
  const id = useId();
  useDismiss(ref, open, () => setOpen(false));
  return (
    <span className="fw-anchor" ref={ref}>
      {cloneElement(trigger, {
        "aria-expanded": open,
        "aria-haspopup": "dialog",
        "aria-controls": open ? id : undefined,
        onClick: () => setOpen(!open),
      })}
      {open && (
        <div id={id} role="dialog" aria-label={label} className={cx("fw-popover", alignEnd && "is-end", className)} {...props}>
          {children}
        </div>
      )}
    </span>
  );
}

export interface DropdownMenuProps {
  trigger: TriggerElement;
  /** <MenuItem>s, <MenuLabel>s and <MenuSeparator>s. Selecting an item closes the menu. */
  children: ReactNode;
  alignEnd?: boolean;
  /** Accessible name of the menu. */
  label?: string;
}

/** A button that opens a menu below it. Arrow keys move between items. */
export function DropdownMenu({ trigger, children, alignEnd, label }: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const id = useId();
  useDismiss(ref, open, () => setOpen(false));
  useEffect(() => {
    if (open) menuRef.current?.querySelector<HTMLElement>('[role="menuitem"]:not(:disabled)')?.focus();
  }, [open]);
  const onKeyDown = (e: KeyboardEvent) => {
    const items = [...(menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]:not(:disabled)') ?? [])];
    const i = items.indexOf(document.activeElement as HTMLElement);
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      items[(i + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length]?.focus();
    } else if (e.key === "Home" || e.key === "End") {
      e.preventDefault();
      items[e.key === "Home" ? 0 : items.length - 1]?.focus();
    }
  };
  return (
    <span className="fw-anchor" ref={ref}>
      {cloneElement(trigger, {
        "aria-expanded": open,
        "aria-haspopup": "menu",
        "aria-controls": open ? id : undefined,
        onClick: () => setOpen(!open),
      })}
      {open && (
        <Menu
          ref={menuRef}
          id={id}
          aria-label={label}
          className={alignEnd ? "is-end" : undefined}
          onKeyDown={onKeyDown}
          onClick={(e) => (e.target as HTMLElement).closest('[role="menuitem"]') && setOpen(false)}
        >
          {children}
        </Menu>
      )}
    </span>
  );
}

/** Opens/closes a native <dialog> with showModal(), so it gets the focus trap, Esc and focus return. */
function useModal(open: boolean, onClose: () => void) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);
  const props = {
    ref,
    onCancel: (e: SyntheticEvent) => {
      e.preventDefault();
      onClose();
    },
    onClick: (e: MouseEvent<HTMLDialogElement>) => {
      // A click on the dialog element itself is a click on the backdrop.
      if (e.target === e.currentTarget) onClose();
    },
  };
  return props;
}

export interface DialogProps extends Omit<HTMLAttributes<HTMLDialogElement>, "title"> {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  /** Muted line under the title. */
  subtitle?: ReactNode;
  /** Buttons, right-aligned in the footer. Secondary first, primary last. */
  footer?: ReactNode;
  /** Use for destructive confirmation; the dialog is announced as an alertdialog. */
  alert?: boolean;
  /** Hide the close button. */
  hideClose?: boolean;
}

function DialogHead({ titleId, title, subtitle, onClose, hideClose, divided }: {
  titleId: string;
  title: ReactNode;
  subtitle?: ReactNode;
  onClose: () => void;
  hideClose?: boolean;
  divided?: boolean;
}) {
  return (
    <div className="fw-dialog-head" style={divided ? { paddingBottom: 16, borderBottom: "1px solid var(--fw-border)" } : undefined}>
      <div>
        <h3 className="fw-dialog-title" id={titleId}>
          {title}
        </h3>
        {subtitle && <p className="fw-card-sub">{subtitle}</p>}
      </div>
      {!hideClose && (
        <Button variant="ghost" size="sm" iconOnly aria-label="Close" onClick={onClose} style={{ margin: "-6px -10px 0 0" }}>
          <IconX />
        </Button>
      )}
    </div>
  );
}

/** Modal dialog. Traps focus, closes on Esc and backdrop click, and returns focus to its trigger. */
export function Dialog({ open, onClose, title, subtitle, footer, alert, hideClose, className, children, ...props }: DialogProps) {
  const modal = useModal(open, onClose);
  const titleId = useId();
  return (
    <dialog {...modal} role={alert ? "alertdialog" : undefined} aria-labelledby={titleId} className={cx("fw-dialog", className)} {...props}>
      {open && (
        <>
          <DialogHead titleId={titleId} title={title} subtitle={subtitle} onClose={onClose} hideClose={hideClose} />
          <div className="fw-dialog-body">{children}</div>
          {footer && <div className="fw-dialog-foot">{footer}</div>}
        </>
      )}
    </dialog>
  );
}

/** Side sheet from the right edge, for forms and detail views. Same behaviour as Dialog. */
export function Drawer({ open, onClose, title, subtitle, footer, hideClose, className, children, ...props }: Omit<DialogProps, "alert">) {
  const modal = useModal(open, onClose);
  const titleId = useId();
  return (
    <dialog {...modal} aria-labelledby={titleId} className={cx("fw-drawer", className)} {...props}>
      {open && (
        <>
          <DialogHead titleId={titleId} title={title} subtitle={subtitle} onClose={onClose} hideClose={hideClose} divided />
          <div className="fw-dialog-body" style={{ paddingTop: 20 }}>
            {children}
          </div>
          {footer && <div className="fw-dialog-foot">{footer}</div>}
        </>
      )}
    </dialog>
  );
}

export interface Command {
  id: string;
  label: string;
  group?: string;
  icon?: ReactNode;
  shortcut?: string;
  /** Extra words to match when searching. */
  keywords?: string[];
  onSelect: () => void;
}

export interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  commands: Command[];
  placeholder?: string;
  /** Open with ⌘K / Ctrl+K. Default true; you still own the open state. */
  onOpenShortcut?: () => void;
}

/** ⌘K palette: a combobox over a grouped listbox. Arrows move, ↵ runs, Esc closes. */
export function CommandPalette({ open, onClose, commands, placeholder = "Search commands", onOpenShortcut }: CommandPaletteProps) {
  const modal = useModal(open, onClose);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const listId = useId();

  useEffect(() => {
    if (!onOpenShortcut) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenShortcut();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onOpenShortcut]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
    }
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? commands.filter((c) => [c.label, c.group ?? "", ...(c.keywords ?? [])].some((s) => s.toLowerCase().includes(q))) : commands;
  }, [commands, query]);

  const run = (c: Command | undefined) => {
    if (!c) return;
    onClose();
    c.onSelect();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (results.length) setActive((i) => (i + (e.key === "ArrowDown" ? 1 : -1) + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      run(results[active]);
    }
  };

  let lastGroup: string | undefined;
  return (
    <dialog {...modal} aria-label="Command palette" className="fw-command">
      {open && (
        <>
          <div className="fw-command-input">
            <IconSearch />
            <input
              autoFocus
              role="combobox"
              aria-expanded="true"
              aria-controls={listId}
              aria-activedescendant={results[active] ? `${listId}-${results[active].id}` : undefined}
              aria-label={placeholder}
              placeholder={placeholder}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActive(0);
              }}
              onKeyDown={onKeyDown}
            />
            <kbd>Esc</kbd>
          </div>
          <Menu id={listId} role="listbox">
            {results.length === 0 && <MenuLabel>No results</MenuLabel>}
            {results.map((c, i) => {
              const header = c.group && c.group !== lastGroup ? <MenuLabel key={`g-${c.group}`}>{c.group}</MenuLabel> : null;
              lastGroup = c.group;
              return [
                header,
                <MenuItem
                  key={c.id}
                  as="li"
                  id={`${listId}-${c.id}`}
                  role="option"
                  aria-selected={i === active}
                  className={i === active ? "is-hover" : undefined}
                  icon={c.icon}
                  shortcut={c.shortcut ?? (i === active ? "↵" : undefined)}
                  onPointerMove={() => setActive(i)}
                  onClick={() => run(c)}
                >
                  {c.label}
                </MenuItem>,
              ];
            })}
          </Menu>
          <div className="fw-command-foot">
            <span>
              <kbd>↑</kbd>
              <kbd>↓</kbd>navigate
            </span>
            <span>
              <kbd>↵</kbd>select
            </span>
            <span>
              <kbd>Esc</kbd>close
            </span>
          </div>
        </>
      )}
    </dialog>
  );
}

