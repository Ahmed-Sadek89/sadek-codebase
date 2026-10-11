import type { CategorySkillsQuery } from "@repo/types/category-skills";

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
};
