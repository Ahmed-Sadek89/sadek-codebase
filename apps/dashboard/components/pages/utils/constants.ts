import type { Page, PagesQuery } from "@repo/types/pages";
import type { ListQueryParams } from "../../../utils/list-query";
import type { PageFormInput } from "../schema";

/** Page size when the URL has no `?limit=`. */
export const PAGES_LIMIT = 10;

/**
 * The list query for the URL's `search`, `page`, `limit`, and `order`.
 * `isActive` is dropped because GET /pages rejects it (400). Shared by the
 * server prefetch and the client hook so both build the same query key.
 */
export function getPagesQuery({ isActive: _isActive, ...params }: ListQueryParams): PagesQuery {
  return { limit: PAGES_LIMIT, ...params };
}

export const PAGE_FORM_DEFAULT_VALUES = {
  name_en: "",
  name_ar: "",
} satisfies PageFormInput;

/** Form values for a row being edited, or the blank defaults when creating. */
export function toPageFormInput(page?: Page | null): PageFormInput {
  if (!page) return PAGE_FORM_DEFAULT_VALUES;
  return { name_en: page.name_en, name_ar: page.name_ar };
}
