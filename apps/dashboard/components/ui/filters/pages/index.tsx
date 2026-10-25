"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePages, usePage } from "@repo/hooks/pages";
import { localized } from "../../../../utils/format";
import { CATEGORY_FILTER_LIMIT } from "../../../../utils/constants";
import {
  SearchableSelectFilter,
  useFilterSearch,
  type SearchableFilterProps,
} from "../searchable-select";

export type PagesFilterProps = SearchableFilterProps;

export function PagesFilter(props: PagesFilterProps) {
  const t = useTranslations();
  const locale = useLocale();
  const state = useFilterSearch();
  const { data, isFetching } = usePages(
    {
      limit: CATEGORY_FILTER_LIMIT,
      ...(state.debouncedSearch && { search: state.debouncedSearch }),
    },
    { enabled: state.open },
  );
  const { data: selected, isPending: isSelectedPending } = usePage(
    props.value ?? undefined,
  );
  const options = (data?.data ?? []).map((item) => ({
    id: item.id,
    label: localized(locale, item.name_en, item.name_ar),
  }));

  return (
    <SearchableSelectFilter
      {...props}
      state={state}
      options={options}
      isFetching={isFetching}
      selectedLabel={
        selected
          ? localized(locale, selected.name_en, selected.name_ar)
          : undefined
      }
      isSelectedPending={isSelectedPending}
      allLabel={t("pageFilterAll")}
      listLabel={t("tablePageFilterLabel")}
      clearLabel={t("pageFilterClear")}
    />
  );
}
