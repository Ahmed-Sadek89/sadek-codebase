import type { Project } from "@repo/types/projects";
import { localize } from "../../../../../utils/localize";

/**
 * The project's categories in the page's language, with their ids: two
 * categories can share a name, so the id is what keys them.
 */
export function getProjectCategories(project: Project, locale: string) {
  return project.categoryProjects.map((category) => ({
    id: category.id,
    name: localize(locale, category.nameEn, category.nameAr),
  }));
}

 