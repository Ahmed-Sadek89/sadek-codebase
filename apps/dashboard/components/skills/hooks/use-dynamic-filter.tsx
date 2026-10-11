"use client";

import { useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { FolderTree } from "@repo/ui/icons";
import { CategorySkillsFilter } from "../../ui/filters/category-skills";
import { updateUrlParams } from "../../../utils/url-params";
import { readPositiveInt } from "../../../utils/list-query";
import { CATEGORY_ID_PARAM, PAGE_PARAM } from "../../../utils/constants";
import type { DynamicFilter } from "../../ui/dynamic-table/types/types";

/**
 * The skills table's dynamic (input) filters, bound to the URL:
 * - Category: a searchable select of skill categories → `?categoryId=<id>`,
 *   which `getSkillsQuery` sends to GET /skills as `categoryId`.
 * Pass the result to `<DynamicTable dynamicFilter={...} />`.
 */
export function useDynamicFilter(): DynamicFilter[] {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const categoryId = readPositiveInt(searchParams.get(CATEGORY_ID_PARAM)) ?? null;

  // A new filter starts from the first page; other params stay.
  const onCategoryChange = useCallback((id: number | null) => {
    updateUrlParams({
      [CATEGORY_ID_PARAM]: id === null ? null : String(id),
      [PAGE_PARAM]: null,
    });
  }, []);

  return useMemo(
    () => [
      {
        paramName: CATEGORY_ID_PARAM,
        label: t("tableCategoryFilterLabel"),
        icon: FolderTree,
        content: (
          <CategorySkillsFilter
            value={categoryId}
            onChange={onCategoryChange}
          />
        ),
      },
    ],
    [categoryId, onCategoryChange, t],
  );
}
