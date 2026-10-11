import type { CategorySkillsQuery } from "@repo/types/category-skills";

/**
 * Shared by the server prefetch and the client hook so both use the same
 * query key. No pagination UI: request the backend's maximum page size (30).
 */
export const CATEGORY_SKILLS_QUERY: CategorySkillsQuery = { limit: 10 };
