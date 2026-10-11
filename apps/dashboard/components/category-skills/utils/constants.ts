import type { CategorySkillsQuery } from "@repo/types/category-skills";
import type { ListQueryParams } from "../../../utils/list-query";

/** Page size when the URL has no `?limit=`; there is no pagination UI. */
export const CATEGORY_SKILLS_LIMIT = 10;

/**
 * The list query for the URL's `search`, `page`, and `limit` (any
 * combination). Shared by the server prefetch and the client hook so both
 * build the same query key.
 */
export function getCategorySkillsQuery(
  params: ListQueryParams,
): CategorySkillsQuery {
  return { limit: CATEGORY_SKILLS_LIMIT, ...params };
}
