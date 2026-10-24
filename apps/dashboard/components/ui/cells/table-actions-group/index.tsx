"use client";

import type { LucideIcon } from "@repo/ui/icons";
import { Button } from "@repo/ui/button";
import { cn } from "@repo/ui/utils";

export type TableAction = {
  key: string;
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  tone?: "default" | "danger" | "success";
  /** Show the label next to the icon (icon-only by default; the label stays as aria-label). */
  showLabel?: boolean;
  hidden?: boolean;
  disabled?: boolean;
};

export type TableActionsGroupProps = {
  actions: TableAction[];
  /** Disables every action, e.g. while a mutation runs. */
  disabled?: boolean;
};

/** Row action buttons; hidden actions are skipped, and nothing renders if none remain. */
export function TableActionsGroup({
  actions,
  disabled,
}: TableActionsGroupProps) {
  const visible = actions.filter((action) => !action.hidden);
  if (visible.length === 0) return null;

  return (
    <div className="flex items-center justify-end gap-1">
      {visible.map(
        ({
          key,
          label,
          icon: Icon,
          onClick,
          tone,
          showLabel,
          disabled: off,
        }) => (
          <Button
            key={key}
            type="button"
            variant="ghost"
            size={showLabel ? "sm" : "icon"}
            disabled={disabled || off}
            aria-label={label}
            title={label}
            onClick={(event) => {
              // Rows may become clickable later; keep actions independent.
              event.stopPropagation();
              onClick();
            }}
            className={cn(
              "h-8 gap-1.5",
              !showLabel && "w-8",
              tone === "danger" &&
              "text-danger hover:bg-danger/10 hover:text-danger",
              tone === "success" &&
              "text-success hover:bg-success/10 hover:text-success",

            )}
          >
            <Icon className="size-4" aria-hidden />
            {showLabel && <span>{label}</span>}
          </Button>
        ),
      )}
    </div>
  );
}
