import type { CategoryProjectsQuery } from "@repo/types/category-projects";
import type { ContactsQuery } from "@repo/types/contacts";
import type { CategorySkillsQuery } from "@repo/types/category-skills";
import type { ProjectsQuery } from "@repo/types/projects";
import type { SeoListQuery, SeoPageName } from "@repo/types/seo";
import type { SkillsQuery } from "@repo/types/skills";
import type { UserCompaniesQuery } from "@repo/types/user-company";
import type { UserInfoQuery } from "@repo/types/user-info";
import type { UsersQuery } from "@repo/types/users";
import type { WhatCanDosQuery } from "@repo/types/what-can-do";

/**
 * TanStack Query keys for every shared hook, one nested object per feature.
 * Each feature starts with its own root segment, so invalidating `all`
 * clears only that feature's cache.
 */
export const queryKeys = {
  auth: {
    all: ["auth"] as const,
    session: () => [...queryKeys.auth.all, "session"] as const,
    me: () => [...queryKeys.auth.all, "me"] as const,
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
    // Under lists(), so every mutation that refreshes lists refreshes these too.
    publicLists: () => [...queryKeys.categorySkills.lists(), "public"] as const,
    publicList: (query: CategorySkillsQuery) =>
      [...queryKeys.categorySkills.publicLists(), query] as const,
    // The "show more" list: pages of `query` (without `page`), one cache entry.
    publicInfinite: (query: Omit<CategorySkillsQuery, "page">) =>
      [...queryKeys.categorySkills.publicLists(), "infinite", query] as const,
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
    // Under lists(), so every mutation that refreshes lists refreshes these too.
    publicLists: () =>
      [...queryKeys.categoryProjects.lists(), "public"] as const,
    publicList: (query: CategoryProjectsQuery) =>
      [...queryKeys.categoryProjects.publicLists(), query] as const,
    details: () => [...queryKeys.categoryProjects.all, "detail"] as const,
    detail: (id: number) =>
      [...queryKeys.categoryProjects.details(), id] as const,
  },
  projects: {
    all: ["projects"] as const,
    lists: () => [...queryKeys.projects.all, "list"] as const,
    list: (query: ProjectsQuery) =>
      [...queryKeys.projects.lists(), query] as const,
    // Under lists(), so every mutation that refreshes lists refreshes these too.
    publicLists: () => [...queryKeys.projects.lists(), "public"] as const,
    publicList: (query: ProjectsQuery) =>
      [...queryKeys.projects.publicLists(), query] as const,
    details: () => [...queryKeys.projects.all, "detail"] as const,
    detail: (id: number) => [...queryKeys.projects.details(), id] as const,
  },
  userInfo: {
    all: ["user-info"] as const,
    lists: () => [...queryKeys.userInfo.all, "list"] as const,
    list: (query: UserInfoQuery) =>
      [...queryKeys.userInfo.lists(), query] as const,
    // Under lists(), so every mutation that refreshes lists refreshes it too.
    public: () => [...queryKeys.userInfo.lists(), "public"] as const,
    mine: () => [...queryKeys.userInfo.all, "mine"] as const,
    details: () => [...queryKeys.userInfo.all, "detail"] as const,
    detail: (id: number) => [...queryKeys.userInfo.details(), id] as const,
  },
  userCompany: {
    all: ["user-company"] as const,
    lists: () => [...queryKeys.userCompany.all, "list"] as const,
    list: (query: UserCompaniesQuery) =>
      [...queryKeys.userCompany.lists(), query] as const,
    // Under lists(), so every mutation that refreshes lists refreshes these too.
    publicLists: () => [...queryKeys.userCompany.lists(), "public"] as const,
    publicList: (query: UserCompaniesQuery) =>
      [...queryKeys.userCompany.publicLists(), query] as const,
    // The "show more" list: pages of `query` (without `page`), one cache entry.
    publicInfinite: (query: Omit<UserCompaniesQuery, "page">) =>
      [...queryKeys.userCompany.publicLists(), "infinite", query] as const,
    mines: () => [...queryKeys.userCompany.all, "mine"] as const,
    mine: (query: UserCompaniesQuery) =>
      [...queryKeys.userCompany.mines(), query] as const,
    details: () => [...queryKeys.userCompany.all, "detail"] as const,
    detail: (id: number) => [...queryKeys.userCompany.details(), id] as const,
  },
  whatCanDo: {
    all: ["what-can-do"] as const,
    lists: () => [...queryKeys.whatCanDo.all, "list"] as const,
    list: (query: WhatCanDosQuery) =>
      [...queryKeys.whatCanDo.lists(), query] as const,
    // Under lists(), so every mutation that refreshes lists refreshes these too.
    publicLists: () => [...queryKeys.whatCanDo.lists(), "public"] as const,
    publicList: (query: WhatCanDosQuery) =>
      [...queryKeys.whatCanDo.publicLists(), query] as const,
    // The "show more" list: pages of `query` (without `page`), one cache entry.
    publicInfinite: (query: Omit<WhatCanDosQuery, "page">) =>
      [...queryKeys.whatCanDo.publicLists(), "infinite", query] as const,
    mines: () => [...queryKeys.whatCanDo.all, "mine"] as const,
    mine: (query: WhatCanDosQuery) =>
      [...queryKeys.whatCanDo.mines(), query] as const,
    details: () => [...queryKeys.whatCanDo.all, "detail"] as const,
    detail: (id: number) => [...queryKeys.whatCanDo.details(), id] as const,
  },
  users: {
    all: ["users"] as const,
    lists: () => [...queryKeys.users.all, "list"] as const,
    list: (query: UsersQuery) => [...queryKeys.users.lists(), query] as const,
    byEmails: () => [...queryKeys.users.all, "by-email"] as const,
    byEmail: (email: string) => [...queryKeys.users.byEmails(), email] as const,
    details: () => [...queryKeys.users.all, "detail"] as const,
    detail: (id: number) => [...queryKeys.users.details(), id] as const,
  },
  contacts: {
    all: ["contacts"] as const,
    lists: () => [...queryKeys.contacts.all, "list"] as const,
    list: (query: ContactsQuery) =>
      [...queryKeys.contacts.lists(), query] as const,
    details: () => [...queryKeys.contacts.all, "detail"] as const,
    detail: (id: number) => [...queryKeys.contacts.details(), id] as const,
  },
  seo: {
    all: ["seo"] as const,
    lists: () => [...queryKeys.seo.all, "list"] as const,
    list: (query: SeoListQuery) =>
      [...queryKeys.seo.lists(), query] as const,
    // Under lists(), so every mutation that refreshes lists refreshes it too.
    public: (pageName: SeoPageName) =>
      [...queryKeys.seo.lists(), "public", pageName] as const,
    details: () => [...queryKeys.seo.all, "detail"] as const,
    detail: (id: number) =>
      [...queryKeys.seo.details(), id] as const,
  },
};
