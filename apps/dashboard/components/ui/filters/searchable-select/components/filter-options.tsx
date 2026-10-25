"use client";

import { useTranslations } from "next-intl";
import { OptionsSkeleton } from "../../../skeleton/options-skeleton";
import { OptionButton } from "../../option-button";
import type { FilterOption } from "../types";

type FilterOptionsProps = {
  options: FilterOption[];
  value: number | null;
  onSelect: (id: number | null) => void;
  isFetching: boolean;
  allLabel: string;
  listLabel: string;
};

export function FilterOptions({
  options,
  value,
  onSelect,
  isFetching,
  allLabel,
  listLabel,
}: FilterOptionsProps) {
  const t = useTranslations();

  return (
    <ul
      aria-label={listLabel}
      aria-busy={isFetching}
      className="max-h-72 overflow-y-auto p-1"
    >
      <li>
        <OptionButton
          label={allLabel}
          isSelected={value === null}
          onClick={() => onSelect(null)}
          muted
        />
      </li>
      {options.length === 0 && isFetching ? (
        <OptionsSkeleton />
      ) : options.length === 0 ? (
        <li className="px-2 py-6 text-center text-sm text-muted-foreground">
          {t("multiSelectEmpty")}
        </li>
      ) : (
        options.map((option) => (
          <li key={option.id}>
            <OptionButton
              label={option.label}
              isSelected={option.id === value}
              onClick={() => onSelect(option.id)}
            />
          </li>
        ))
      )}
    </ul>
  );
}
