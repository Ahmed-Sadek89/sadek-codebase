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
  Layers,
  ListFilter,
} from "@repo/ui/icons";
import { updateUrlParams } from "../../../../utils/url-params";
import { readIsActive, readSortOrder } from "../../../../utils/list-query";
import {
  IS_ACTIVE_PARAM,
  ORDER_PARAM,
  PAGE_PARAM,
} from "../../../../utils/constants";
import type { StaticFilter } from "../types/types";

/**
 * The table's static (chip) filters, bound to the URL; `readListQueryParams`
 * sends them to the list endpoint:
 * - Sort: `?order=asc|desc` → `order`
 * - Status: `?isActive=true|false` → `isActive` (unset = all)
 * Pass the result to `<DynamicTable staticFilter={...} />`.
 */
export function useStaticFilter(): StaticFilter[] {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const order = readSortOrder(searchParams.get(ORDER_PARAM));
  const isActive = readIsActive(searchParams.get(IS_ACTIVE_PARAM));

  // A new filter starts from the first page; other params (search, limit) stay.
  const onOrderChange = useCallback((value: string | null) => {
    updateUrlParams({ [ORDER_PARAM]: value, [PAGE_PARAM]: null });
  }, []);
  const onStatusChange = useCallback((value: string | null) => {
    updateUrlParams({ [IS_ACTIVE_PARAM]: value, [PAGE_PARAM]: null });
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
          { value: "true", label: t("statusActive"), icon: CircleCheck },
          { value: "false", label: t("statusInactive"), icon: CircleOff },
        ],
        value: isActive === undefined ? null : String(isActive),
        onChange: onStatusChange,
      },
    ],
    [isActive, onOrderChange, onStatusChange, order, t],
  );
}
