"use client";

import { useMemo, useState } from "react";
import { usePublicCategoryProjects } from "@repo/hooks/category-projects";
import { usePublicProjects } from "@repo/hooks/projects";
import { categoryProjectsQuery, projectsQuery } from "../../utils";

/**
 * GET /projects/public filtered by the selected GET /category-projects/public
 * item. `undefined` means "All", which matches the server prefetch.
 */
export function useWork() {
  const [categoryId, setCategoryId] = useState<number | undefined>();
  const query = useMemo(
    () => (categoryId ? { ...projectsQuery, categoryId } : projectsQuery),
    [categoryId],
  );
  const projects = usePublicProjects(query);
  const categories = usePublicCategoryProjects(categoryProjectsQuery);

  return {
    projects: projects.data?.data ?? [],
    categories: categories.data?.data ?? [],
    categoryId,
    setCategoryId,
    isPending: projects.isPending,
    // True while a new category loads; the previous rows stay on screen.
    isFetching: projects.isFetching,
  };
}
