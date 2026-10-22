import type { Project } from "@repo/types/projects";

/** "WEB · MOBILE · 2024": the project's categories and the year it was added. */
export function getProjectEyebrow(project: Project) {
  const year = new Date(project.createdAt).getUTCFullYear();
  const categories = project.categoryProjects.map((category) =>
    category.nameEn.toUpperCase(),
  );
  return [...categories, year].join(" · ");
}
