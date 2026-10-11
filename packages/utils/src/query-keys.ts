import type { CategoryProjectsQuery } from "@repo/types/category-projects";
import type { CategorySkillsQuery } from "@repo/types/category-skills";
import type { SkillsQuery } from "@repo/types/skills";

/**
 * TanStack Query keys for every shared hook, one nested object per feature.
 * Each feature starts with its own root segment, so invalidating `all`
 * clears only that feature's cache.
 */
export const queryKeys = {
  auth: {
    all: ["auth"] as const,
    session: () => [...queryKeys.auth.all, "session"] as const,
    login: () => [...queryKeys.auth.all, "login"] as const,
    refresh: () => [...queryKeys.auth.all, "refresh"] as const,
    changePassword: () => [...queryKeys.auth.all, "change-password"] as const,
    logout: () => [...queryKeys.auth.all, "logout"] as const,
  },
  categorySkills: {
    all: ["category-skills"] as const,
    lists: () => [...queryKeys.categorySkills.all, "list"] as const,
    list: (query: CategorySkillsQuery) =>
      [...queryKeys.categorySkills.lists(), query] as const,
    details: () => [...queryKeys.categorySkills.all, "detail"] as const,
    detail: (id: number) =>
      [...queryKeys.categorySkills.details(), id] as const,
  },
  skills: {
    all: ["skills"] as const,
    lists: () => [...queryKeys.skills.all, "list"] as const,
    list: (query: SkillsQuery) => [...queryKeys.skills.lists(), query] as const,
    details: () => [...queryKeys.skills.all, "detail"] as const,
    detail: (id: number) => [...queryKeys.skills.details(), id] as const,
  },
  categoryProjects: {
    all: ["category-projects"] as const,
    lists: () => [...queryKeys.categoryProjects.all, "list"] as const,
    list: (query: CategoryProjectsQuery) =>
      [...queryKeys.categoryProjects.lists(), query] as const,
    details: () => [...queryKeys.categoryProjects.all, "detail"] as const,
    detail: (id: number) =>
      [...queryKeys.categoryProjects.details(), id] as const,
  },
  projects: {
    all: ["projects"] as const,
    // GET /projects takes no query: one list per user.
    list: () => [...queryKeys.projects.all, "list"] as const,
    details: () => [...queryKeys.projects.all, "detail"] as const,
    detail: (id: number) => [...queryKeys.projects.details(), id] as const,
  },
};
