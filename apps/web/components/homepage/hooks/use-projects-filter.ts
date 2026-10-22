"use client";

import { useMemo, useState } from "react";
import { projectsQuery } from "../utils";

/**
 * The selected Work category and the GET /projects/public query it
 * produces. `undefined` means "All", which matches the server prefetch.
 */
export function useProjectsFilter() {
  const [categoryId, setCategoryId] = useState<number | undefined>();
  const query = useMemo(
    () => (categoryId ? { ...projectsQuery, categoryId } : projectsQuery),
    [categoryId],
  );
  return { categoryId, setCategoryId, query };
}
