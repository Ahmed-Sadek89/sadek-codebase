"use client";

import type { ComponentProps } from "react";
import { cn } from "@repo/ui/utils";

export type ToolbarButtonProps = ComponentProps<"button"> & {
  /** Accessible name and tooltip. */
  label: string;
  active?: boolean;
};

/** An icon-only toggle in the editor toolbar; keeps the editor's selection when pressed. */
export function ToolbarButton({
  label,
  active = false,
  className,
  onMouseDown,
  ...props
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      title={label}
      onMouseDown={(event) => {
        // Don't steal focus (and the selection) from the editor.
        event.preventDefault();
        onMouseDown?.(event);
      }}
      className={cn(
        "grid size-8 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4",
        active && "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary",
        className,
      )}
      {...props}
    />
  );
}
