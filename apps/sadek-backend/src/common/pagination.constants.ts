export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MIN_PAGE: 1,
  MIN_LIMIT: 1,
  MAX_LIMIT: 30,
  DEFAULT_ORDER: 'DESC',
} as const;

export type SortOrder = 'ASC' | 'DESC';

