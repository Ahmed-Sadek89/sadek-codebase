"use client";

import {
  keepPreviousData,
  useQueryClient,
  type QueryClient,
} from "@repo/libs/query";
import { skillsService } from "@repo/services/skills";
import type {
  CreateSkillRequest,
  SkillsQuery,
  UpdateSkillRequest,
} from "@repo/types/skills";
import { queryKeys } from "@repo/utils/query-keys";
import { useGuardedMutation, useGuardedQuery } from "./api";

// Category details count their skills and public categories embed them, so refresh both.
function invalidateSkillLists(client: QueryClient) {
  return Promise.all([
    client.invalidateQueries({ queryKey: queryKeys.skills.lists() }),
    client.invalidateQueries({ queryKey: queryKeys.categorySkills.details() }),
    // Public categories embed their skills.
    client.invalidateQueries({
      queryKey: queryKeys.categorySkills.publicLists(),
    }),
  ]);
}

/** GET /skills: the signed-in user's skills, paginated. */
export function useSkills(query: SkillsQuery = {}) {
  return useGuardedQuery({
    queryKey: queryKeys.skills.list(query),
    queryFn: (auth) => skillsService.findAll(query, auth),
    // Keep the current rows on screen while a new search loads.
    placeholderData: keepPreviousData,
  });
}

/** GET /skills/:id */
export function useSkill(id: number | undefined) {
  return useGuardedQuery({
    queryKey: queryKeys.skills.detail(id ?? 0),
    queryFn: (auth) => skillsService.findOne(id!, auth),
    enabled: id !== undefined,
  });
}

export function useCreateSkill() {
  const client = useQueryClient();
  return useGuardedMutation({
    mutationFn: (request: CreateSkillRequest, auth) =>
      skillsService.create(request, auth),
    onSuccess: () => invalidateSkillLists(client),
  });
}

export function useUpdateSkill() {
  const client = useQueryClient();
  return useGuardedMutation({
    mutationFn: (
      { id, data }: { id: number; data: UpdateSkillRequest },
      auth,
    ) => skillsService.update(id, data, auth),
    onSuccess: (_response, { id }) =>
      Promise.all([
        invalidateSkillLists(client),
        client.invalidateQueries({ queryKey: queryKeys.skills.detail(id) }),
      ]),
  });
}

export function useDeleteSkill() {
  const client = useQueryClient();
  return useGuardedMutation({
    mutationFn: (id: number, auth) => skillsService.remove(id, auth),
    onSuccess: (_response, id) => {
      client.removeQueries({ queryKey: queryKeys.skills.detail(id) });
      return invalidateSkillLists(client);
    },
  });
}
