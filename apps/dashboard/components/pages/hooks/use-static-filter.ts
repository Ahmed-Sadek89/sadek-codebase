"use client";

import { useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  ArrowDownWideNarrow,
  ArrowUpDown,
  ArrowUpNarrowWide,
} from "@repo/ui/icons";
import { updateUrlParams } from "../../../utils/url-params";
import { readSortOrder } from "../../../utils/list-query";
import { ORDER_PARAM, PAGE_PARAM } from "../../../utils/constants";
import type { StaticFilter } from "../../ui/dynamic-table/types/types";

/**
 * The pages table's only chip filter, bound to the URL: sort by created date,
 * `?order=asc|desc` → `order` on GET /pages.
 */
export function useStaticFilter(): StaticFilter[] {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const order = readSortOrder(searchParams.get(ORDER_PARAM));

  // A new sort starts from the first page; other params (limit) stay.
  const onOrderChange = useCallback((value: string | null) => {
    updateUrlParams({ [ORDER_PARAM]: value, [PAGE_PARAM]: null });
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
    ],
    [onOrderChange, order, t],
  );
}
