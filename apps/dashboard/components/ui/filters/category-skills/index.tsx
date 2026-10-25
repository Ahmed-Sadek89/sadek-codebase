"use client";

import { useLocale, useTranslations } from "next-intl";
import {
  useCategorySkills,
  useCategorySkill,
} from "@repo/hooks/category-skills";
import { localized } from "../../../../utils/format";
import { CATEGORY_FILTER_LIMIT } from "../../../../utils/constants";
import {
  SearchableSelectFilter,
  useFilterSearch,
  type SearchableFilterProps,
} from "../searchable-select";

export type CategorySkillsFilterProps = SearchableFilterProps;

export function CategorySkillsFilter(props: CategorySkillsFilterProps) {
  const t = useTranslations();
  const locale = useLocale();
  const state = useFilterSearch();
  const { data, isFetching } = useCategorySkills(
    {
      limit: CATEGORY_FILTER_LIMIT,
      ...(state.debouncedSearch && { search: state.debouncedSearch }),
    },
    { enabled: state.open },
  );
  const { data: selected, isPending: isSelectedPending } = useCategorySkill(
    props.value ?? undefined,
  );
  const options = (data?.data ?? []).map((item) => ({
    id: item.id,
    label: localized(locale, item.nameEn, item.nameAr),
  }));

  return (
    <SearchableSelectFilter
      {...props}
      state={state}
      options={options}
      isFetching={isFetching}
      selectedLabel={
        selected
          ? localized(locale, selected.nameEn, selected.nameAr)
          : undefined
      }
      isSelectedPending={isSelectedPending}
      allLabel={t("categoryFilterAll")}
      listLabel={t("tableCategoryFilterLabel")}
      clearLabel={t("categoryFilterClear")}
    />
  );
}
