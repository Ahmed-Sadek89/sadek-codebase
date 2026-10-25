import type {
  WhatCanDoDetails,
  WhatCanDosQuery,
} from "@repo/types/what-can-do";
import type { ListQueryParams } from "../../../utils/list-query";
import type { WhatCanDoFormInput } from "../schema";

/** Page size when the URL has no `?limit=`. */
export const WHAT_CAN_DOS_LIMIT = 10;

/** Longest short description and description shown in a table cell; the full text is in the hover title and the details dialog. */
export const WHAT_CAN_DO_SHORT_DESCRIPTION_PREVIEW_MAX = 60;

/**
 * The list query for the URL's `search`, `page`, `limit`, `order`, and
 * `isActive` (any combination). Shared by the server prefetch and the client
 * hook so both build the same query key.
 */
export function getWhatCanDosQuery(params: ListQueryParams): WhatCanDosQuery {
  return { limit: WHAT_CAN_DOS_LIMIT, ...params };
}

export const WHAT_CAN_DO_FORM_DEFAULT_VALUES = {
  title_en: "",
  title_ar: "",
  shortDescription_en: "",
  shortDescription_ar: "",
  description_en: "",
  description_ar: "",
  rank: "",
  isActive: true,
} satisfies WhatCanDoFormInput;

/**
 * Form values for a row being edited, or the blank defaults when creating;
 * a new item's rank starts at `nextRank` (e.g. the current item count).
 */
export function toWhatCanDoFormInput(
  item?: WhatCanDoDetails | null,
  nextRank?: number,
): WhatCanDoFormInput {
  if (!item) {
    return {
      ...WHAT_CAN_DO_FORM_DEFAULT_VALUES,
      rank: nextRank === undefined ? "" : String(nextRank),
    };
  }
  return {
    title_en: item.title_en,
    title_ar: item.title_ar ?? "",
    shortDescription_en: item.shortDescription_en ?? "",
    shortDescription_ar: item.shortDescription_ar ?? "",
    description_en: item.description_en ?? "",
    description_ar: item.description_ar ?? "",
    rank: String(item.rank),
    isActive: item.isActive,
  };
}
