"use client";

import { keepPreviousData, useQueryClient } from "@repo/libs/query";
import { categorySkillsService } from "@repo/services/category-skills";
import type {
  CategorySkillsQuery,
  CreateCategorySkillRequest,
  UpdateCategorySkillRequest,
} from "@repo/types/category-skills";
import { queryKeys } from "@repo/utils/query-keys";
import { useGuardedMutation, useGuardedQuery } from "./api";

/**
 * GET /category-skills/private: the signed-in user's categories, paginated.
 * `enabled: false` holds the request back (e.g. until a select opens).
 */
export function useCategorySkills(
  query: CategorySkillsQuery = {},
  { enabled = true }: { enabled?: boolean } = {},
) {
  return useGuardedQuery({
    queryKey: queryKeys.categorySkills.list(query),
    queryFn: (auth) => categorySkillsService.findAll(query, auth),
    enabled,
    // Keep the current rows on screen while a new search loads.
    placeholderData: keepPreviousData,
  });
}

/** GET /category-skills/:id: one category with its linked-skills count. */
export function useCategorySkill(id: number | undefined) {
  return useGuardedQuery({
    queryKey: queryKeys.categorySkills.detail(id ?? 0),
    queryFn: (auth) => categorySkillsService.findOne(id!, auth),
    enabled: id !== undefined,
  });
}

export function useCreateCategorySkill() {
  const client = useQueryClient();
  return useGuardedMutation({
    mutationFn: (request: CreateCategorySkillRequest, auth) =>
      categorySkillsService.create(request, auth),
    onSuccess: () =>
      client.invalidateQueries({ queryKey: queryKeys.categorySkills.lists() }),
  });
}

export function useUpdateCategorySkill() {
  const client = useQueryClient();
  return useGuardedMutation({
    mutationFn: (
      { id, data }: { id: number; data: UpdateCategorySkillRequest },
      auth,
    ) => categorySkillsService.update(id, data, auth),
    onSuccess: (_response, { id }) =>
      Promise.all([
        client.invalidateQueries({
          queryKey: queryKeys.categorySkills.lists(),
        }),
        client.invalidateQueries({
          queryKey: queryKeys.categorySkills.detail(id),
        }),
        // Skills embed category names.
        client.invalidateQueries({ queryKey: queryKeys.skills.all }),
      ]),
  });
}

export function useDeleteCategorySkill() {
  const client = useQueryClient();
  return useGuardedMutation({
    mutationFn: (id: number, auth) => categorySkillsService.remove(id, auth),
    onSuccess: (_response, id) => {
      client.removeQueries({ queryKey: queryKeys.categorySkills.detail(id) });
      return client.invalidateQueries({
        queryKey: queryKeys.categorySkills.lists(),
      });
    },
  });
}
