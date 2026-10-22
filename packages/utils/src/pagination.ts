import type { PaginatedResponse } from "@repo/types/common";

/**
 * `getNextPageParam` for infinite queries over a `paginate()` envelope: the
 * next page number, or `undefined` once the last page is loaded.
 */
export function getNextPageParam(
  lastPage: Pick<PaginatedResponse<unknown>, "page" | "totalPage">,
): number | undefined {
  return lastPage.page < lastPage.totalPage ? lastPage.page + 1 : undefined;
}
