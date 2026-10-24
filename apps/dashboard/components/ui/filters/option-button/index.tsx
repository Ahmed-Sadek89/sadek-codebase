"use client";

import { Check } from "@repo/ui/icons";
import { cn } from "@repo/ui/utils";

type OptionButtonProps = {
  label: string;
  isSelected: boolean;
  onClick: () => void;
  /** Muted text, e.g. for the "All …" option. */
  muted?: boolean;
};

/** One row of a filter's option list: a check mark when selected, then the label. */
export function OptionButton({
  label,
  isSelected,
  onClick,
  muted = false,
}: OptionButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={isSelected}
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-start text-sm outline-none transition-colors",
        "hover:bg-muted focus-visible:bg-muted",
        isSelected && "bg-primary/10 font-medium text-primary",
        muted && !isSelected && "text-muted-foreground",
      )}
    >
      <Check
        className={cn("size-4 shrink-0", !isSelected && "invisible")}
        aria-hidden
      />
      <span dir="auto" className="truncate">
        {label}
      </span>
    </button>
  );
}
