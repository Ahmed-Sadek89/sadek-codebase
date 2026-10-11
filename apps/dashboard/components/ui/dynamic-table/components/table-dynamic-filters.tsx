"use client";

import { useId } from "react";
import type { DynamicFilter } from "../types/types";

export type TableDynamicFiltersProps = {
  filters: DynamicFilter[];
};

/** One row under the static filters: per filter, a label then its input. */
export function TableDynamicFilters({ filters }: TableDynamicFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-border bg-muted/20 px-4 py-3 sm:px-5">
      {filters.map((filter) => (
        <DynamicFilterGroup key={filter.paramName} filter={filter} />
      ))}
    </div>
  );
}

function DynamicFilterGroup({ filter }: { filter: DynamicFilter }) {
  const labelId = useId();
  const LabelIcon = filter.icon;

  return (
    <div
      role="group"
      aria-labelledby={labelId}
      className="flex w-full flex-wrap items-center gap-2 sm:w-auto"
    >
      <span
        id={labelId}
        className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground"
      >
        {LabelIcon && <LabelIcon className="size-3.5" aria-hidden />}
        {filter.label}
      </span>
      {filter.content}
    </div>
  );
}
