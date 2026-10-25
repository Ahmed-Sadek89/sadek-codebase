/**
 * List-query rules shared by the backend (PaginationQueryDto, paginate(),
 * every Filter*Dto `search`) and the clients that build those queries.
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MIN_PAGE: 1,
  MIN_LIMIT: 1,
  MAX_LIMIT: 30,
  DEFAULT_ORDER: "DESC",
} as const;

/** Values `order` accepts. */
export const SORT_ORDERS = ["ASC", "DESC"] as const;
export type SortOrder = (typeof SORT_ORDERS)[number];

/** Max length of a list's `search` text. */
export const SEARCH_MAX = 20;
