"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  useCategorySkill,
  useCategorySkills,
} from "@repo/hooks/category-skills";
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/popover";
import { Check, ChevronsUpDown, Loader2, Search, X } from "@repo/ui/icons";
import { cn } from "@repo/ui/utils";
import { localized } from "../../../../utils/format";
import {
  CATEGORY_FILTER_LIMIT,
  SEARCH_DEBOUNCE_MS,
  SEARCH_MAX_LENGTH,
} from "../../../../utils/constants";

export type CategorySkillsFilterProps = {
  /** Selected category id, or null for all categories. */
  value: number | null;
  onChange: (id: number | null) => void;
  className?: string;
};

/**
 * Searchable single select over the user's skill categories: loads
 * CATEGORY_FILTER_LIMIT (10) at a time from GET /category-skills/private,
 * searched on the server (debounced). The selected name comes from
 * GET /category-skills/:id, so it shows even when the id came from the URL.
 */
export function CategorySkillsFilter({
  value,
  onChange,
  className,
}: CategorySkillsFilterProps) {
  const t = useTranslations();
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timeout = setTimeout(
      () => setDebouncedSearch(search.trim()),
      SEARCH_DEBOUNCE_MS,
    );
    return () => clearTimeout(timeout);
  }, [search]);

  const { data, isFetching } = useCategorySkills({
    limit: CATEGORY_FILTER_LIMIT,
    ...(debouncedSearch && { search: debouncedSearch }),
  });
  const { data: selected, isPending: isSelectedPending } = useCategorySkill(
    value ?? undefined,
  );
  const options = data?.data ?? [];

  const select = (id: number | null) => {
    onChange(id);
    setOpen(false);
  };

  const triggerText =
    value === null
      ? t("categoryFilterAll")
      : selected
        ? localized(locale, selected.nameEn, selected.nameAr)
        : isSelectedPending
          ? t("multiSelectLoading")
          : `#${value}`;

  return (
    <div className={cn("relative w-full sm:w-64", className)}>
      <Popover
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) setSearch("");
        }}
      >
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              "flex h-9 w-full items-center justify-between gap-2 rounded-md border border-input bg-background ps-3 text-start text-sm transition-colors outline-none",
              "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50",
              value === null ? "pe-3" : "border-primary/50 pe-9",
            )}
          >
            <span
              dir="auto"
              className={cn(
                "truncate",
                value === null && "text-muted-foreground",
              )}
            >
              {triggerText}
            </span>
            {value === null && (
              <ChevronsUpDown
                className="size-4 shrink-0 text-muted-foreground"
                aria-hidden
              />
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-(--radix-popover-trigger-width) min-w-64 p-0"
        >
          <div className="flex items-center gap-2 border-b border-border px-3">
            <Search
              className="size-4 shrink-0 text-muted-foreground"
              aria-hidden
            />
            <input
              type="search"
              value={search}
              maxLength={SEARCH_MAX_LENGTH}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t("multiSelectSearch")}
              aria-label={t("multiSelectSearch")}
              className="h-10 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:hidden"
            />
            {isFetching && (
              <Loader2
                className="size-4 shrink-0 animate-spin text-muted-foreground"
                aria-hidden
              />
            )}
          </div>
          <ul
            aria-label={t("tableCategoryFilterLabel")}
            aria-busy={isFetching}
            className="max-h-72 overflow-y-auto p-1"
          >
            <li>
              <OptionButton
                label={t("categoryFilterAll")}
                isSelected={value === null}
                onClick={() => select(null)}
                muted
              />
            </li>
            {options.length === 0 ? (
              <li className="px-2 py-6 text-center text-sm text-muted-foreground">
                {isFetching ? t("multiSelectLoading") : t("multiSelectEmpty")}
              </li>
            ) : (
              options.map((category) => (
                <li key={category.id}>
                  <OptionButton
                    label={localized(locale, category.nameEn, category.nameAr)}
                    isSelected={category.id === value}
                    onClick={() => select(category.id)}
                  />
                </li>
              ))
            )}
          </ul>
        </PopoverContent>
      </Popover>
      {value !== null && (
        // A sibling of the trigger (not inside it): buttons can't nest.
        <button
          type="button"
          onClick={() => onChange(null)}
          aria-label={t("categoryFilterClear")}
          title={t("categoryFilterClear")}
          className="absolute end-1.5 top-1/2 -translate-y-1/2 rounded-sm p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="size-3.5" aria-hidden />
        </button>
      )}
    </div>
  );
}

function OptionButton({
  label,
  isSelected,
  onClick,
  muted = false,
}: {
  label: string;
  isSelected: boolean;
  onClick: () => void;
  muted?: boolean;
}) {
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
