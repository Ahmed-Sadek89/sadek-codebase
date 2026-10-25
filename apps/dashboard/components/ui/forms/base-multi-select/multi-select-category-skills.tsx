"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useCategorySkills } from "@repo/hooks/category-skills";
import type { NamedRef } from "@repo/types/common";
import { BaseMultiSelect } from ".";
import { localized } from "../../../../utils/format";
import {
  MAX_LIMIT,
  SEARCH_DEBOUNCE_MS,
  SEARCH_MAX,
} from "../../../../utils/constants";

export type MultiSelectCategorySkillsProps = {
  value: NamedRef[];
  onChange: (value: NamedRef[]) => void;
  onBlur?: () => void;
  error?: string;
  disabled?: boolean;
  id?: string;
};

/**
 * Picks the skill's categories from the user's own, searched on the server
 * (GET /category-skills/private?search=, debounced) a page of MAX_LIMIT at a time.
 * Nothing is fetched until the list is opened.
 */
export function MultiSelectCategorySkills({
  value,
  onChange,
  onBlur,
  error,
  disabled,
  id,
}: MultiSelectCategorySkillsProps) {
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

  const { data, isFetching } = useCategorySkills(
    {
      limit: MAX_LIMIT,
      ...(debouncedSearch && { search: debouncedSearch }),
    },
    { enabled: open },
  );

  return (
    <BaseMultiSelect<NamedRef>
      id={id}
      label={t("skillFormCategoriesLabel")}
      placeholder={t("skillFormCategoriesPlaceholder")}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      options={data?.data ?? []}
      getKey={(category) => category.id}
      getLabel={(category) =>
        localized(locale, category.nameEn, category.nameAr)
      }
      search={search}
      onSearchChange={setSearch}
      searchMaxLength={SEARCH_MAX}
      isLoading={isFetching}
      onOpenChange={setOpen}
      error={error}
      disabled={disabled}
    />
  );
}
