"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useSkills } from "@repo/hooks/skills";
import { BaseMultiSelect } from ".";
import {
  MAX_LIMIT,
  SEARCH_DEBOUNCE_MS,
  SEARCH_MAX,
} from "../../../../utils/constants";

/** A picked skill: enough to show its chip. */
export type SkillOption = { id: number; name: string };

export type MultiSelectSkillsProps = {
  value: SkillOption[];
  onChange: (value: SkillOption[]) => void;
  onBlur?: () => void;
  label?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  id?: string;
};

/**
 * Picks skills from the user's own, searched on the server
 * (GET /skills?search=, debounced) a page of MAX_LIMIT at a time.
 * Nothing is fetched until the list is opened.
 */
export function MultiSelectSkills({
  value,
  onChange,
  onBlur,
  label,
  placeholder,
  error,
  disabled,
  id,
}: MultiSelectSkillsProps) {
  const t = useTranslations();
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

  const { data, isFetching } = useSkills(
    {
      limit: MAX_LIMIT,
      ...(debouncedSearch && { search: debouncedSearch }),
    },
    { enabled: open },
  );

  return (
    <BaseMultiSelect<SkillOption>
      id={id}
      label={label ?? t("multiSelectSkillsLabel")}
      placeholder={placeholder ?? t("multiSelectSkillsPlaceholder")}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      options={(data?.data ?? []).map(({ id: skillId, name }) => ({
        id: skillId,
        name,
      }))}
      getKey={(skill) => skill.id}
      getLabel={(skill) => skill.name}
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
