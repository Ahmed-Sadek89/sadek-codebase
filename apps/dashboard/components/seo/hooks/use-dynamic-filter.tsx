"use client";

import { useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { FileText } from "@repo/ui/icons";
import { PagesFilter } from "../../ui/filters/pages";
import { updateUrlParams } from "../../../utils/url-params";
import { readPositiveInt } from "../../../utils/list-query";
import { PAGE_PARAM, SEO_PAGE_ID_PARAM } from "../../../utils/constants";
import type { DynamicFilter } from "../../ui/dynamic-table/types/types";

/**
 * The SEO table's dynamic (input) filters, bound to the URL:
 * - Page: a searchable select of the user's pages → `?pageId=<id>`, which
 *   `getSeoListQuery` sends to GET /seo as `pageId`.
 * Pass the result to `<DynamicTable dynamicFilter={...} />`.
 */
export function useDynamicFilter(): DynamicFilter[] {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const pageId = readPositiveInt(searchParams.get(SEO_PAGE_ID_PARAM)) ?? null;

  // A new filter starts from the first page of results; other params stay.
  const onPageChange = useCallback((id: number | null) => {
    updateUrlParams({
      [SEO_PAGE_ID_PARAM]: id === null ? null : String(id),
      [PAGE_PARAM]: null,
    });
  }, []);

  return useMemo(
    () => [
      {
        paramName: SEO_PAGE_ID_PARAM,
        label: t("tablePageFilterLabel"),
        icon: FileText,
        content: <PagesFilter value={pageId} onChange={onPageChange} />,
      },
    ],
    [onPageChange, pageId, t],
  );
}
