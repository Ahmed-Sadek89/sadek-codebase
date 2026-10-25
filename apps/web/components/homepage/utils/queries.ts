import type { CategoryProjectsQuery } from "@repo/types/category-projects";
import type { CategorySkillsQuery } from "@repo/types/category-skills";
import type { ProjectsQuery } from "@repo/types/projects";
import type { UserCompaniesQuery } from "@repo/types/user-company";
import type { WhatCanDosQuery } from "@repo/types/what-can-do";

// Queries for the public endpoints. app/page.tsx prefetches with the same
// objects, so the query keys match and the hydrated cache is reused.
// 10 is the backend's max limit: a portfolio shows everything on one page.
/** Services load 5 at a time; "Show more" fetches the next page. */
export const whatCanDoQuery: Omit<WhatCanDosQuery, "page"> = {
  limit: 5,
  isActive: true,
};
/** Skill categories load 10 at a time; "Show more" fetches the next page. */
export const categorySkillsQuery: Omit<CategorySkillsQuery, "page"> = {
  limit: 5,
  isActive: true,
};
export const userCompanyQuery: UserCompaniesQuery = { limit: 10 };
/** The Experience timeline loads 5 jobs at a time; "Show more" fetches the next page. */
export const experienceQuery: Omit<UserCompaniesQuery, "page"> = { limit: 5 };
/**
 * Work: 10 category chips and 6 projects per page; each has its own "show
 * more". 6 = the featured card (2×2) + 5 cards, which fills 3 rows of 3.
 */
export const categoryProjectsQuery: Omit<CategoryProjectsQuery, "page"> = {
  limit: 10,
  isActive: true,
};
export const projectsQuery: Omit<ProjectsQuery, "page"> = {
  limit: 6,
  isActive: true,
};
