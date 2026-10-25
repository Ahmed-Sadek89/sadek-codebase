"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@repo/ui/input-group";
import { Search, X } from "@repo/ui/icons";
import { cn } from "@repo/ui/utils";
import { updateUrlParams } from "../../../../utils/url-params";
import {
  PAGE_PARAM,
  SEARCH_DEBOUNCE_MS,
  SEARCH_MAX,
  SEARCH_PARAM,
} from "../../../../utils/constants";

export type SearchInputProps = {
  /** URL query param to write; read it with `useSearchParams` to filter. */
  paramName?: string;
  placeholder?: string;
  maxLength?: number;
  className?: string;
};

/**
 * Search box (shadcn InputGroup) that mirrors its trimmed value into a URL
 * query param, debounced by SEARCH_DEBOUNCE_MS (400 ms).
 */
export function SearchInput({
  paramName = SEARCH_PARAM,
  placeholder,
  maxLength = SEARCH_MAX,
  className,
}: SearchInputProps) {
  const t = useTranslations();
  const searchParams = useSearchParams();
  // Start from the URL so a shared or reloaded link keeps its search.
  const urlValue = searchParams.get(paramName) ?? "";
  const [value, setValue] = useState(urlValue);
  const [syncedUrlValue, setSyncedUrlValue] = useState(urlValue);

  // Follow changes made elsewhere (e.g. "Reset filters") during render, not in
  // an effect; typing does not trigger this because the URL only changes once
  // the debounce fires.
  if (urlValue !== syncedUrlValue) {
    setSyncedUrlValue(urlValue);
    if (value.trim() !== urlValue) setValue(urlValue);
  }

  useEffect(() => {
    const next = value.trim();
    const current =
      new URLSearchParams(window.location.search).get(paramName) ?? "";
    if (next === current) return;

    const timeout = setTimeout(
      // A new search starts from the first page; other params (e.g. limit) stay.
      () => updateUrlParams({ [paramName]: next, [PAGE_PARAM]: null }),
      SEARCH_DEBOUNCE_MS,
    );
    // Each keystroke restarts the timer.
    return () => clearTimeout(timeout);
  }, [value, paramName]);

  return (
    <InputGroup className={cn("h-9 w-full sm:max-w-xs", className)}>
      <InputGroupAddon>
        <Search aria-hidden />
      </InputGroupAddon>
      <InputGroupInput
        type="search"
        value={value}
        maxLength={maxLength}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder ?? t("tableSearchPlaceholder")}
        aria-label={placeholder ?? t("tableSearchPlaceholder")}
        className="[&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            size="icon-xs"
            variant="ghost"
            onClick={() => setValue("")}
            aria-label={t("tableSearchClear")}
            className="text-muted-foreground"
          >
            <X aria-hidden />
          </InputGroupButton>
        </InputGroupAddon>
      )}
    </InputGroup>
  );
}
