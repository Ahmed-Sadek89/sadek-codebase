import type { Project } from "@repo/types/projects";
import { localize } from "../../../../utils/localize";

/** "WEB · MOBILE · 2024": the project's categories and the year it was added. */
export function getProjectEyebrow(project: Project, locale: string) {
  const year = new Date(project.createdAt).getUTCFullYear();
  const categories = project.categoryProjects.map((category) =>
    localize(locale, category.nameEn, category.nameAr).toLocaleUpperCase(
      locale,
    ),
  );
  return [...categories, year].join(" · ");
}
