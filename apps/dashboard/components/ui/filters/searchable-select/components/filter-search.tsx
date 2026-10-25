"use client";

import { useTranslations } from "next-intl";
import { Loader2, Search } from "@repo/ui/icons";
import { SEARCH_MAX } from "../../../../../utils/constants";

type FilterSearchProps = {
  value: string;
  onChange: (value: string) => void;
  isFetching: boolean;
};

export function FilterSearch({
  value,
  onChange,
  isFetching,
}: FilterSearchProps) {
  const t = useTranslations();

  return (
    <div className="flex items-center gap-2 border-b border-border px-3">
      <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden />
      <input
        type="search"
        value={value}
        maxLength={SEARCH_MAX}
        onChange={(event) => onChange(event.target.value)}
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
  );
}
