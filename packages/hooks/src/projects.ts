"use client";

import { useQueryClient } from "@repo/libs/query";
import { projectsService } from "@repo/services/projects";
import type {
  CreateProjectRequest,
  UpdateProjectRequest,
} from "@repo/types/projects";
import { queryKeys } from "@repo/utils/query-keys";
import { useGuardedMutation, useGuardedQuery } from "./api";

/** GET /projects: every project of the signed-in user (not paginated). */
export function useProjects() {
  return useGuardedQuery({
    queryKey: queryKeys.projects.list(),
    queryFn: (auth) => projectsService.findAll(auth),
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
      client.invalidateQueries({ queryKey: queryKeys.projects.list() }),
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
        client.invalidateQueries({ queryKey: queryKeys.projects.list() }),
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
      return client.invalidateQueries({ queryKey: queryKeys.projects.list() });
    },
  });
}
