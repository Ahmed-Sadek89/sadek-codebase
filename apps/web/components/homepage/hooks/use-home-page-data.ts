"use client";

import { usePublicCategoryProjects } from "@repo/hooks/category-projects";
import { usePublicCategorySkills } from "@repo/hooks/category-skills";
import { usePublicProjects } from "@repo/hooks/projects";
import { usePublicSkills } from "@repo/hooks/skills";
import { usePublicUserCompanies } from "@repo/hooks/user-company";
import { usePublicUserInfos } from "@repo/hooks/user-info";
import { usePublicWhatCanDos } from "@repo/hooks/what-can-do";
import {
  categoryProjectsQuery,
  categorySkillsQuery,
  skillsQuery,
  toQueryState,
  userCompanyQuery,
  userInfoQuery,
  whatCanDoQuery,
} from "../utils";
import { useProjectsFilter } from "./use-projects-filter";

const listOf = <T>(response: { data: T[] } | undefined) => response?.data ?? [];
 
export function useHomePageData() {
  // Changing the Work category refetches only the projects query.
  const projectsFilter = useProjectsFilter();

  const userInfos = usePublicUserInfos(userInfoQuery);
  const userCompanies = usePublicUserCompanies(userCompanyQuery);
  const whatCanDos = usePublicWhatCanDos(whatCanDoQuery);
  const skills = usePublicSkills(skillsQuery);
  const categorySkills = usePublicCategorySkills(categorySkillsQuery);
  const projects = usePublicProjects(projectsFilter.query);
  const categoryProjects = usePublicCategoryProjects(categoryProjectsQuery);

  return {
    // The public user-info list holds the default-view user's single row.
    userInfo: toQueryState(userInfos, (response) => response?.data[0]),
    companies: toQueryState(userCompanies, listOf),
    services: toQueryState(whatCanDos, listOf),
    skills: toQueryState(skills, listOf),
    skillCategories: toQueryState(categorySkills, listOf),
    projects: {
      ...toQueryState(projects, listOf),
      isFetching: projects.isFetching,
    },
    projectCategories: toQueryState(categoryProjects, listOf),
    projectsFilter,
  };
}
