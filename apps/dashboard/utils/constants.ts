import { Monitor, Moon, Sun } from "@repo/ui/icons";

export const SIGNED_OUT_REDIRECT_PATH = "/";

export const THEME_OPTIONS = [
  { value: "light", labelKey: "themeLight", icon: Sun },
  { value: "dark", labelKey: "themeDark", icon: Moon },
  { value: "system", labelKey: "themeSystem", icon: Monitor },
] as const;

// Language names stay in their own language so users can always find theirs.
export const LANGUAGE_OPTIONS = [
  { value: "en", label: "English", flag: "/logo/en.svg" },
  { value: "ar", label: "العربية", flag: "/logo/ar.svg" },
  { value: "de", label: "Deutsch", flag: "/logo/de.svg" },
  { value: "ru", label: "Русский", flag: "/logo/ru.svg" },
] as const;

export const DEFAULT_THEME = "system";

/** Cell style shared by data tables and TableContentSkeleton. */
export const TABLE_CELL_CLASS_NAME =
  "border-b border-border px-4 py-3 text-start align-top";

/** URL query param written by the table search input. */
export const SEARCH_PARAM = "search";

/** URL query param for the list sort order (`asc` | `desc`), sent as `order`. */
export const ORDER_PARAM = "order";

/** URL query param for the active-status filter (`true` | `false`), sent as `isActive`. */
export const IS_ACTIVE_PARAM = "isActive";

/** URL query param for the SEO page filter (a page id), sent as `pageId`. */
export const SEO_PAGE_ID_PARAM = "pageId";

/** URL query param for the skill-category filter (a category id), sent as `categoryId`. */
export const CATEGORY_ID_PARAM = "categoryId";

/** Options a table's category filter loads per search. */
export const CATEGORY_FILTER_LIMIT = 10;

/** Params cleared by the table's "Reset filters" button. */
export const FILTER_PARAMS = [
  SEARCH_PARAM,
  ORDER_PARAM,
  IS_ACTIVE_PARAM,
  CATEGORY_ID_PARAM,
  SEO_PAGE_ID_PARAM,
];

/** Delay between the last keystroke and updating the URL. */
export const SEARCH_DEBOUNCE_MS = 400;

/** Backend list DTOs reject `search` longer than 20 characters (400). */
export const SEARCH_MAX_LENGTH = 20;

/** URL query params for the requested page and page size. */
export const PAGE_PARAM = "page";
export const LIMIT_PARAM = "limit";

/** Backend list DTOs reject `limit` above 30 (400). */
export const MAX_LIMIT = 10;

/** Choices in the table's rows-per-page select. */
export const PAGE_SIZE_OPTIONS = [5, 10, 15, 20] as const;
