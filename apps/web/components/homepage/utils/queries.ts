import type { CategoryProjectsQuery } from "@repo/types/category-projects";
import type { CategorySkillsQuery } from "@repo/types/category-skills";
import type { ProjectsQuery } from "@repo/types/projects";
import type { SkillsQuery } from "@repo/types/skills";
import type { UserCompaniesQuery } from "@repo/types/user-company";
import type { WhatCanDosQuery } from "@repo/types/what-can-do";

// Queries for the public endpoints. app/page.tsx prefetches with the same
// objects, so the query keys match and the hydrated cache is reused.
// 10 is the backend's max limit: a portfolio shows everything on one page.
export const whatCanDoQuery: WhatCanDosQuery = { limit: 10 };
export const skillsQuery: SkillsQuery = { limit: 10, isActive: true };
export const categorySkillsQuery: CategorySkillsQuery = {
  limit: 10,
  isActive: true,
};
export const userCompanyQuery: UserCompaniesQuery = { limit: 20 };
export const categoryProjectsQuery: CategoryProjectsQuery = {
  limit: 10,
  isActive: true,
};
export const projectsQuery: ProjectsQuery = { limit: 10, isActive: true };
