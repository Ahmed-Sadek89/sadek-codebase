"use client";

import { keepPreviousData, useQueryClient } from "@repo/libs/query";
import { categoryProjectsService } from "@repo/services/category-projects";
import type {
  CategoryProjectsQuery,
  CreateCategoryProjectRequest,
  UpdateCategoryProjectRequest,
} from "@repo/types/category-projects";
import { queryKeys } from "@repo/utils/query-keys";
import { useGuardedMutation, useGuardedQuery, usePublicQuery } from "./api";

/**
 * GET /category-projects: the signed-in user's categories, paginated.
 * `enabled: false` holds the request back (e.g. until a select opens).
 */
export function useCategoryProjects(
  query: CategoryProjectsQuery = {},
  { enabled = true }: { enabled?: boolean } = {},
) {
  return useGuardedQuery({
    queryKey: queryKeys.categoryProjects.list(query),
    queryFn: (auth) => categoryProjectsService.findAll(query, auth),
    enabled,
    // Keep the current rows on screen while a new search loads.
    placeholderData: keepPreviousData,
  });
}

/** GET /category-projects/public: the default-view user's categories, paginated. No sign-in needed. */
export function usePublicCategoryProjects(query: CategoryProjectsQuery = {}) {
  return usePublicQuery({
    queryKey: queryKeys.categoryProjects.publicList(query),
    queryFn: () => categoryProjectsService.findAllPublic(query),
    // Keep the current rows on screen while a new page or search loads.
    placeholderData: keepPreviousData,
  });
}

/** GET /category-projects/:id */
export function useCategoryProject(id: number | undefined) {
  return useGuardedQuery({
    queryKey: queryKeys.categoryProjects.detail(id ?? 0),
    queryFn: (auth) => categoryProjectsService.findOne(id!, auth),
    enabled: id !== undefined,
  });
}

export function useCreateCategoryProject() {
  const client = useQueryClient();
  return useGuardedMutation({
    mutationFn: (request: CreateCategoryProjectRequest, auth) =>
      categoryProjectsService.create(request, auth),
    onSuccess: () =>
      client.invalidateQueries({
        queryKey: queryKeys.categoryProjects.lists(),
      }),
  });
}

export function useUpdateCategoryProject() {
  const client = useQueryClient();
  return useGuardedMutation({
    mutationFn: (
      { id, data }: { id: number; data: UpdateCategoryProjectRequest },
      auth,
    ) => categoryProjectsService.update(id, data, auth),
    onSuccess: (_response, { id }) =>
      Promise.all([
        client.invalidateQueries({
          queryKey: queryKeys.categoryProjects.lists(),
        }),
        client.invalidateQueries({
          queryKey: queryKeys.categoryProjects.detail(id),
        }),
        // Projects embed category names.
        client.invalidateQueries({ queryKey: queryKeys.projects.all }),
      ]),
  });
}

export function useDeleteCategoryProject() {
  const client = useQueryClient();
  return useGuardedMutation({
    mutationFn: (id: number, auth) => categoryProjectsService.remove(id, auth),
    onSuccess: (_response, id) => {
      client.removeQueries({ queryKey: queryKeys.categoryProjects.detail(id) });
      return Promise.all([
        client.invalidateQueries({
          queryKey: queryKeys.categoryProjects.lists(),
        }),
        client.invalidateQueries({ queryKey: queryKeys.projects.all }),
      ]);
    },
  });
}
