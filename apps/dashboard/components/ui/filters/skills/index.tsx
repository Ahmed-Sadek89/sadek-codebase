"use client";

import { useTranslations } from "next-intl";
import { useSkill, useSkills } from "@repo/hooks/skills";
import { CATEGORY_FILTER_LIMIT } from "../../../../utils/constants";
import {
  SearchableSelectFilter,
  useFilterSearch,
  type SearchableFilterProps,
} from "../searchable-select";

export type SkillsFilterProps = SearchableFilterProps;

/**
 * A searchable single select over the user's skills (GET /skills, server
 * search, fetched only while open); the selected name comes from GET /skills/:id.
 */
export function SkillsFilter(props: SkillsFilterProps) {
  const t = useTranslations();
  const state = useFilterSearch();
  const { data, isFetching } = useSkills(
    {
      limit: CATEGORY_FILTER_LIMIT,
      ...(state.debouncedSearch && { search: state.debouncedSearch }),
    },
    { enabled: state.open },
  );
  const { data: selected, isPending: isSelectedPending } = useSkill(
    props.value ?? undefined,
  );
  const options = (data?.data ?? []).map((skill) => ({
    id: skill.id,
    label: skill.name,
  }));

  return (
    <SearchableSelectFilter
      {...props}
      state={state}
      options={options}
      isFetching={isFetching}
      selectedLabel={selected?.name}
      isSelectedPending={isSelectedPending}
      allLabel={t("skillFilterAll")}
      listLabel={t("tableSkillFilterLabel")}
      clearLabel={t("skillFilterClear")}
    />
  );
}
