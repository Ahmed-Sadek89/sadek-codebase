/** Sort direction for list endpoints; the backend sorts by `createdAt`. */
export type SortOrder = "ASC" | "DESC";

/**
 * Query params shared by paginated list endpoints.
 * Backend defaults: page 1, limit 10 (max 30), order DESC.
 */
export interface PaginationQuery {
  page?: number;
  limit?: number;
  order?: SortOrder;
}

/** Envelope returned by every paginated list endpoint. */
export interface PaginatedResponse<T> {
  page: number;
  limit: number;
  totalPage: number;
  total: number;
  data: T[];
}

/** Dates arrive as ISO 8601 strings after JSON serialization. */
export type IsoDateString = string;
