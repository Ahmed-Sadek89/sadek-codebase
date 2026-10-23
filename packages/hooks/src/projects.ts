"use client";

import {
  keepPreviousData,
  useInfiniteQuery,
  useQueryClient,
} from "@repo/libs/query";
import { projectsService } from "@repo/services/projects";
import type {
  CreateProjectRequest,
  ProjectsQuery,
  UpdateProjectRequest,
} from "@repo/types/projects";
import { getNextPageParam } from "@repo/utils/pagination";
import { queryKeys } from "@repo/utils/query-keys";
import { useGuardedMutation, useGuardedQuery } from "./api";

/** GET /projects: the signed-in user's projects, paginated and filtered. */
export function useProjects(query: ProjectsQuery = {}) {
  return useGuardedQuery({
    queryKey: queryKeys.projects.list(query),
    queryFn: (auth) => projectsService.findAll(query, auth),
    // Keep the current rows on screen while a new page or search loads.
    placeholderData: keepPreviousData,
  });
}

/**
 * GET /projects/public, page by page: `fetchNextPage()` appends the next
 * `query.limit` projects and `hasNextPage` turns false after the last page.
 * Changing the filters (e.g. `categoryId`) keeps the previous pages on screen
 * (`isPlaceholderData`) until the new first page arrives. No sign-in needed.
 */
export function usePublicProjects(query: Omit<ProjectsQuery, "page"> = {}) {
  return useInfiniteQuery({
    queryKey: queryKeys.projects.publicList(query),
    queryFn: ({ pageParam }) =>
      projectsService.findAllPublic({ ...query, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam,
    placeholderData: keepPreviousData,
  });
}

/** GET /projects/:id */
export function useProject(id: number | undefined) {
  return useGuardedQuery({
    queryKey: queryKeys.projects.detail(id ?? 0),
    queryFn: (auth) => projectsService.findOne(id!, auth),
    enabled: id !== undefined,
  });
}

export function useCreateProject() {
  const client = useQueryClient();
  return useGuardedMutation({
    mutationFn: (request: CreateProjectRequest, auth) =>
      projectsService.create(request, auth),
    onSuccess: () =>
      client.invalidateQueries({ queryKey: queryKeys.projects.lists() }),
  });
}

export function useUpdateProject() {
  const client = useQueryClient();
  return useGuardedMutation({
    mutationFn: (
      { id, data }: { id: number; data: UpdateProjectRequest },
      auth,
    ) => projectsService.update(id, data, auth),
    onSuccess: (_response, { id }) =>
      Promise.all([
        client.invalidateQueries({ queryKey: queryKeys.projects.lists() }),
        client.invalidateQueries({ queryKey: queryKeys.projects.detail(id) }),
      ]),
  });
}

export function useDeleteProject() {
  const client = useQueryClient();
  return useGuardedMutation({
    mutationFn: (id: number, auth) => projectsService.remove(id, auth),
    onSuccess: (_response, id) => {
      client.removeQueries({ queryKey: queryKeys.projects.detail(id) });
      return client.invalidateQueries({ queryKey: queryKeys.projects.lists() });
    },
  });
}
