"use client";

import { useLocale, useTranslations } from "next-intl";
import {
  useCategoryProjects,
  useCategoryProject,
} from "@repo/hooks/category-projects";
import { localized } from "../../../../utils/format";
import { CATEGORY_FILTER_LIMIT } from "../../../../utils/constants";
import {
  SearchableSelectFilter,
  useFilterSearch,
  type SearchableFilterProps,
} from "../searchable-select";

export type CategoryProjectsFilterProps = SearchableFilterProps;

export function CategoryProjectsFilter(props: CategoryProjectsFilterProps) {
  const t = useTranslations();
  const locale = useLocale();
  const state = useFilterSearch();
  const { data, isFetching } = useCategoryProjects(
    {
      limit: CATEGORY_FILTER_LIMIT,
      ...(state.debouncedSearch && { search: state.debouncedSearch }),
    },
    { enabled: state.open },
  );
  const { data: selected, isPending: isSelectedPending } = useCategoryProject(
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
