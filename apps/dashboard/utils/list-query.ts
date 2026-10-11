import type { PaginationQuery, SortOrder } from "@repo/types/common";
import {
  IS_ACTIVE_PARAM,
  LIMIT_PARAM,
  MAX_LIMIT,
  ORDER_PARAM,
  PAGE_PARAM,
  SEARCH_MAX_LENGTH,
  SEARCH_PARAM,
} from "./constants";

/** List filters read from the URL; each one is optional. */
export type ListQueryParams = Pick<PaginationQuery, "page" | "limit" | "order"> & {
  search?: string;
  isActive?: boolean;
};

/** Reads one URL param; adapts both server `searchParams` and `useSearchParams`. */
export type ParamReader = (name: string) => string | null | undefined;

/** Reader for a server page's awaited `searchParams` record (first value wins). */
export function recordParamReader(
  record: Record<string, string | string[] | undefined>,
): ParamReader {
  return (name) => {
    const value = record[name];
    return Array.isArray(value) ? value[0] : value;
  };
}

function readPositiveInt(raw: string | null | undefined): number | undefined {
  if (!raw || !/^\d+$/.test(raw)) return undefined;
  const value = Number(raw);
  return value >= 1 ? value : undefined;
}

/** `?order=asc|desc` (any case) as the backend's `ASC` | `DESC`. */
export function readSortOrder(
  raw: string | null | undefined,
): SortOrder | undefined {
  const value = raw?.toUpperCase();
  return value === "ASC" || value === "DESC" ? value : undefined;
}

/** `?isActive=true|false`; anything else means "all". */
export function readIsActive(raw: string | null | undefined): boolean | undefined {
  if (raw === "true") return true;
  if (raw === "false") return false;
  return undefined;
}

/**
 * Parses `?search=&page=&limit=&order=&isActive=` (any combination). Invalid values are dropped
 * rather than sent, since the backend answers them with 400. `limit` is capped
 * at the backend maximum. Pure, so the server prefetch and the client query
 * produce the same object, and therefore the same query key.
 */
export function readListQueryParams(get: ParamReader): ListQueryParams {
  const search = get(SEARCH_PARAM)?.trim().slice(0, SEARCH_MAX_LENGTH);
  const page = readPositiveInt(get(PAGE_PARAM));
  const limit = readPositiveInt(get(LIMIT_PARAM));
  const order = readSortOrder(get(ORDER_PARAM));
  const isActive = readIsActive(get(IS_ACTIVE_PARAM));

  return {
    ...(search && { search }),
    ...(page !== undefined && { page }),
    ...(limit !== undefined && { limit: Math.min(limit, MAX_LIMIT) }),
    ...(order && { order }),
    ...(isActive !== undefined && { isActive }),
  };
}
