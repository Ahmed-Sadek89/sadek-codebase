"use client";

import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { ChevronsUpDown } from "@repo/ui/icons";
import { cn } from "@repo/ui/utils";

type FilterTriggerProps = ComponentPropsWithoutRef<"button"> & {
  text: string;
  hasValue: boolean;
};

export const FilterTrigger = forwardRef<HTMLButtonElement, FilterTriggerProps>(
  function FilterTrigger({ text, hasValue, className, ...props }, ref) {
    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          "flex h-9 w-full items-center justify-between gap-2 rounded-md border border-input bg-background ps-3 text-start text-sm transition-colors outline-none",
          "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50",
          hasValue ? "border-primary/50 pe-9" : "pe-3",
          className,
        )}
        {...props}
      >
        <span
          dir="auto"
          className={cn("truncate", !hasValue && "text-muted-foreground")}
        >
          {text}
        </span>
        {!hasValue && (
          <ChevronsUpDown
            className="size-4 shrink-0 text-muted-foreground"
            aria-hidden
          />
        )}
      </button>
    );
  },
);
