"use client";

import { usePublicCategoryProjects } from "@repo/hooks/category-projects";
import { useInfinitePublicCategorySkills } from "@repo/hooks/category-skills";
import { usePublicProjects } from "@repo/hooks/projects";
import {
  useInfinitePublicUserCompanies,
  usePublicUserCompanies,
} from "@repo/hooks/user-company";
import { usePublicUserInfo } from "@repo/hooks/user-info";
import { useInfinitePublicWhatCanDos } from "@repo/hooks/what-can-do";
import {
  categoryProjectsQuery,
  categorySkillsQuery,
  toInfiniteState,
  toQueryState,
  experienceQuery,
  userCompanyQuery,
  whatCanDoQuery,
} from "../utils";
import { useProjectsFilter } from "./use-projects-filter";

const listOf = <T>(response: { data: T[] } | undefined) => response?.data ?? [];

export function useHomePageData() {
  // Changing the Work category refetches only the projects query.
  const projectsFilter = useProjectsFilter();

  const userInfo = usePublicUserInfo();
  const userCompanies = usePublicUserCompanies(userCompanyQuery);
  // The timeline pages separately from the companies carousel.
  const experience = useInfinitePublicUserCompanies(experienceQuery);
  const whatCanDos = useInfinitePublicWhatCanDos(whatCanDoQuery);
  const categorySkills = useInfinitePublicCategorySkills(categorySkillsQuery);
  const projects = usePublicProjects(projectsFilter.query);
  const categoryProjects = usePublicCategoryProjects(categoryProjectsQuery);

  return {
    // GET /user-info/public: the default-view user's row (404 when there is none).
    userInfo: toQueryState(userInfo, (response) => response),
    companies: toQueryState(userCompanies, listOf),
    experience: toInfiniteState(experience),
    // Infinite lists: every loaded page plus "show more".
    services: toInfiniteState(whatCanDos),
    skillCategories: toInfiniteState(categorySkills),
    projects: {
      ...toQueryState(projects, listOf),
      // True only while another category loads behind the previous rows
      // (keepPreviousData). Unlike isFetching, it is false on the server and
      // on the first client render, so hydration matches.
      isSwitching: projects.isPlaceholderData,
    },
    projectCategories: toQueryState(categoryProjects, listOf),
    projectsFilter,
  };
}
