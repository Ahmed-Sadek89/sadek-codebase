"use client";

import { useTranslations } from "next-intl";
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/popover";
import { cn } from "@repo/ui/utils";
import { ClearButton } from "./components/clear-button";
import { FilterOptions } from "./components/filter-options";
import { FilterSearch } from "./components/filter-search";
import { FilterTrigger } from "./components/filter-trigger";
import type { useFilterSearch } from "./hooks/use-filter-search";
import type { FilterOption, SearchableFilterProps } from "./types";

export { useFilterSearch } from "./hooks/use-filter-search";
export type { FilterOption, SearchableFilterProps } from "./types";

type SearchableSelectFilterProps = SearchableFilterProps & {
  state: ReturnType<typeof useFilterSearch>;
  options: FilterOption[];
  isFetching: boolean;
  selectedLabel?: string;
  isSelectedPending: boolean;
  allLabel: string;
  listLabel: string;
  clearLabel: string;
};

export function SearchableSelectFilter({
  value,
  onChange,
  className,
  state,
  options,
  isFetching,
  selectedLabel,
  isSelectedPending,
  allLabel,
  listLabel,
  clearLabel,
}: SearchableSelectFilterProps) {
  const t = useTranslations();

  const select = (id: number | null) => {
    onChange(id);
    state.setOpen(false);
  };

  const triggerText =
    value === null
      ? allLabel
      : (selectedLabel ??
        (isSelectedPending ? t("multiSelectLoading") : `#${value}`));

  return (
    <div className={cn("relative w-full sm:w-64", className)}>
      <Popover open={state.open} onOpenChange={state.onOpenChange}>
        <PopoverTrigger asChild>
          <FilterTrigger text={triggerText} hasValue={value !== null} />
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-(--radix-popover-trigger-width) min-w-64 p-0"
        >
          <FilterSearch
            value={state.search}
            onChange={state.setSearch}
            isFetching={isFetching}
          />
          <FilterOptions
            options={options}
            value={value}
            onSelect={select}
            isFetching={isFetching}
            allLabel={allLabel}
            listLabel={listLabel}
          />
        </PopoverContent>
      </Popover>
      {value !== null && (
        <ClearButton label={clearLabel} onClick={() => onChange(null)} />
      )}
    </div>
  );
}
