"use client";

import { useId } from "react";
import { Check } from "@repo/ui/icons";
import { cn } from "@repo/ui/utils";
import type { StaticFilter } from "../types/types";

export type TableStaticFiltersProps = {
  filters: StaticFilter[];
};

/** One row under the table header: per filter, a label then its chips. */
export function TableStaticFilters({ filters }: TableStaticFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-border bg-muted/20 px-4 py-3 sm:px-5">
      {filters.map((filter) => (
        <StaticFilterGroup key={filter.paramName} filter={filter} />
      ))}
    </div>
  );
}

function StaticFilterGroup({ filter }: { filter: StaticFilter }) {
  const labelId = useId();
  const LabelIcon = filter.icon;

  return (
    <div
      role="group"
      aria-labelledby={labelId}
      className="flex flex-wrap items-center gap-2"
    >
      <span
        id={labelId}
        className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground"
      >
        {LabelIcon && <LabelIcon className="size-3.5" aria-hidden />}
        {filter.label}
      </span>
      {filter.options.map((option) => {
        const isSelected = filter.value === option.value;
        const Icon = isSelected ? Check : option.icon;
        return (
          <button
            key={option.value ?? "all"}
            type="button"
            aria-pressed={isSelected}
            // Clicking the selected chip clears the filter (selects "all").
            onClick={() => filter.onChange(isSelected ? null : option.value)}
            className={cn(
              "inline-flex h-7 items-center gap-1.5 rounded-full border px-3 text-xs font-medium transition-colors",
              "focus-visible:ring-ring/50 outline-none focus-visible:ring-[3px]",
              isSelected
                ? "border-primary bg-primary text-primary-foreground shadow-xs hover:bg-primary/90"
                : "border-border bg-card text-foreground hover:border-border-strong hover:bg-muted",
            )}
          >
            {Icon && <Icon className="size-3.5" aria-hidden />}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
