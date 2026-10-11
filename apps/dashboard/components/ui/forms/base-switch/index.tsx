"use client";

import { useId, type ComponentProps, type ReactNode } from "react";
import { Switch } from "@repo/ui/switch";
import { cn } from "@repo/ui/utils";

export type BaseSwitchProps = Omit<ComponentProps<typeof Switch>, "children"> & {
  label: string;
  /** Short hint under the label. */
  description?: string;
  /** Optional leading icon, e.g. `<Eye className="size-4" />`. */
  icon?: ReactNode;
  /** Pill text shown at the end, e.g. "On" / "Off". */
  checkedText?: string;
  uncheckedText?: string;
  error?: string;
  containerClassName?: string;
};

/**
 * Switch laid out as a selectable card: the whole card toggles it, the card
 * tints while on, and the layout follows the page direction (LTR/RTL).
 */
export function BaseSwitch({
  label,
  description,
  icon,
  checkedText,
  uncheckedText,
  error,
  id,
  checked,
  disabled,
  containerClassName,
  "aria-describedby": describedBy,
  "aria-invalid": invalid,
  ...props
}: BaseSwitchProps) {
  const generatedId = useId();
  const switchId = id ?? generatedId;
  const hintId = `${switchId}-hint`;
  const errorId = `${switchId}-error`;
  const descriptionIds = [
    describedBy,
    description ? hintId : undefined,
    error ? errorId : undefined,
  ]
    .filter(Boolean)
    .join(" ");
  const statusText = checked ? checkedText : uncheckedText;

  return (
    <div className={cn("flex flex-col gap-y-2", containerClassName)}>
      <label
        htmlFor={switchId}
        data-state={checked ? "checked" : "unchecked"}
        data-disabled={disabled || undefined}
        className={cn(
          "group/base-switch flex w-full cursor-pointer items-center gap-3 rounded-lg border border-border bg-card p-3 text-start font-normal transition-colors sm:p-4",
          "hover:bg-muted/40 has-focus-visible:ring-[3px] has-focus-visible:ring-ring/50",
          "data-[state=checked]:border-primary/40 data-[state=checked]:bg-primary/5",
          "data-disabled:cursor-not-allowed data-disabled:opacity-60",
          error && "border-danger data-[state=checked]:border-danger",
        )}
      >
        {icon && (
          <span
            aria-hidden
            className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground transition-colors group-data-[state=checked]/base-switch:bg-primary/10 group-data-[state=checked]/base-switch:text-primary"
          >
            {icon}
          </span>
        )}
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="text-sm font-medium text-foreground">{label}</span>
          {description && (
            <span id={hintId} className="text-sm text-muted-foreground">
              {description}
            </span>
          )}
        </span>
        <span className="flex shrink-0 items-center gap-2">
          {statusText && (
            <span
              aria-hidden
              className="hidden rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground transition-colors group-data-[state=checked]/base-switch:bg-primary/10 group-data-[state=checked]/base-switch:text-primary sm:inline"
            >
              {statusText}
            </span>
          )}
          <Switch
            {...props}
            id={switchId}
            checked={checked}
            disabled={disabled}
            aria-invalid={error ? true : invalid}
            aria-describedby={descriptionIds || undefined}
          />
        </span>
      </label>
      {error && (
        <p id={errorId} role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
