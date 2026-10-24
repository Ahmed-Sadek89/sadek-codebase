"use client";

import { useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  ArrowDownWideNarrow,
  ArrowUpDown,
  ArrowUpNarrowWide,
  CircleCheck,
  CircleOff,
  FileText,
  Layers,
  ListFilter,
} from "@repo/ui/icons";
import { updateUrlParams } from "../../../utils/url-params";
import { readIsActive, readSortOrder } from "../../../utils/list-query";
import { readSeoPageName, SEO_PAGES } from "../utils/constants";
import {
  IS_ACTIVE_PARAM,
  ORDER_PARAM,
  PAGE_PARAM,
  SEO_PAGE_NAME_PARAM,
} from "../../../utils/constants";
import type { StaticFilter } from "../../ui/dynamic-table/types/types";

/**
 * The SEO table's static (chip) filters, bound to the URL;
 * `readListQueryParams` sends them to GET /seo:
 * - Sort: `?order=asc|desc` → `order`
 * - Status: `?isActive=true|false` → `isActive` (unset = all)
 * - Page: `?pageName=home|…` → `pageName` (unset = every page)
 * Pass the result to `<DynamicTable staticFilter={...} />`.
 */
export function useStaticFilter(): StaticFilter[] {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const order = readSortOrder(searchParams.get(ORDER_PARAM));
  const isActive = readIsActive(searchParams.get(IS_ACTIVE_PARAM));
  const pageName = readSeoPageName(searchParams.get(SEO_PAGE_NAME_PARAM));

  // A new filter starts from the first page; other params (search, limit) stay.
  const onOrderChange = useCallback((value: string | null) => {
    updateUrlParams({ [ORDER_PARAM]: value, [PAGE_PARAM]: null });
  }, []);
  const onStatusChange = useCallback((value: string | null) => {
    updateUrlParams({ [IS_ACTIVE_PARAM]: value, [PAGE_PARAM]: null });
  }, []);
  const onPageNameChange = useCallback((value: string | null) => {
    updateUrlParams({ [SEO_PAGE_NAME_PARAM]: value, [PAGE_PARAM]: null });
  }, []);

  return useMemo(
    () => [
      {
        paramName: ORDER_PARAM,
        label: t("tableSortLabel"),
        icon: ArrowUpDown,
        options: [
          { value: "asc", label: t("tableSortAsc"), icon: ArrowUpNarrowWide },
          { value: "desc", label: t("tableSortDesc"), icon: ArrowDownWideNarrow },
        ],
        value: order?.toLowerCase() ?? null,
        onChange: onOrderChange,
      },
      {
        paramName: IS_ACTIVE_PARAM,
        label: t("tableStatusLabel"),
        icon: ListFilter,
        options: [
          { value: null, label: t("tableStatusAll"), icon: Layers },
          { value: "true", label: t("seoStatusLive"), icon: CircleCheck },
          { value: "false", label: t("seoStatusDraft"), icon: CircleOff },
        ],
        value: isActive === undefined ? null : String(isActive),
        onChange: onStatusChange,
      },
      {
        paramName: SEO_PAGE_NAME_PARAM,
        label: t("seoFilterPageLabel"),
        icon: FileText,
        options: [
          { value: null, label: t("tableStatusAll"), icon: Layers },
          ...SEO_PAGES.map((page) => ({
            value: page.value,
            label: t(page.labelKey),
          })),
        ],
        value: pageName ?? null,
        onChange: onPageNameChange,
      },
    ],
    [isActive, onOrderChange, onPageNameChange, onStatusChange, order, pageName, t],
  );
}
