"use client";

import {
  keepPreviousData,
  useInfiniteQuery,
  useQueryClient,
} from "@repo/libs/query";
import { instructorExperienceService } from "@repo/services/instructor-experience";
import type {
  CreateInstructorExperienceRequest,
  InstructorExperiencesQuery,
  UpdateInstructorExperienceRequest,
} from "@repo/types/instructor-experience";
import { getNextPageParam } from "@repo/utils/pagination";
import { queryKeys } from "@repo/utils/query-keys";
import { useGuardedMutation, useGuardedQuery } from "./api";

/** GET /instructor-experience: the signed-in user's rows, paginated and filtered. */
export function useInstructorExperiences(
  query: InstructorExperiencesQuery = {},
) {
  return useGuardedQuery({
    queryKey: queryKeys.instructorExperience.list(query),
    queryFn: (auth) => instructorExperienceService.findAll(query, auth),
    // Keep the current rows on screen while a new page or search loads.
    placeholderData: keepPreviousData,
  });
}

/**
 * GET /instructor-experience/public, page by page: `fetchNextPage()` appends
 * the next `query.limit` rows and `hasNextPage` turns false after the last
 * page. Sorted by rank, lowest first. No sign-in needed.
 */
export function usePublicInstructorExperiences(
  query: Omit<InstructorExperiencesQuery, "page" | "isActive"> = {},
) {
  return useInfiniteQuery({
    queryKey: queryKeys.instructorExperience.publicList(query),
    queryFn: ({ pageParam }) =>
      instructorExperienceService.findAllPublic({ ...query, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam,
    placeholderData: keepPreviousData,
  });
}

/** GET /instructor-experience/:id */
export function useInstructorExperience(id: number | undefined) {
  return useGuardedQuery({
    queryKey: queryKeys.instructorExperience.detail(id ?? 0),
    queryFn: (auth) => instructorExperienceService.findOne(id!, auth),
    enabled: id !== undefined,
  });
}

export function useCreateInstructorExperience() {
  const client = useQueryClient();
  return useGuardedMutation({
    mutationFn: (request: CreateInstructorExperienceRequest, auth) =>
      instructorExperienceService.create(request, auth),
    onSuccess: () =>
      client.invalidateQueries({
        queryKey: queryKeys.instructorExperience.lists(),
      }),
  });
}

export function useUpdateInstructorExperience() {
  const client = useQueryClient();
  return useGuardedMutation({
    mutationFn: (
      { id, data }: { id: number; data: UpdateInstructorExperienceRequest },
      auth,
    ) => instructorExperienceService.update(id, data, auth),
    onSuccess: (_response, { id }) =>
      Promise.all([
        client.invalidateQueries({
          queryKey: queryKeys.instructorExperience.lists(),
        }),
        client.invalidateQueries({
          queryKey: queryKeys.instructorExperience.detail(id),
        }),
      ]),
  });
}

export function useToggleInstructorExperienceActive() {
  const client = useQueryClient();
  return useGuardedMutation({
    mutationFn: (id: number, auth) =>
      instructorExperienceService.toggleActive(id, auth),
    onSuccess: (_response, id) =>
      Promise.all([
        client.invalidateQueries({
          queryKey: queryKeys.instructorExperience.lists(),
        }),
        client.invalidateQueries({
          queryKey: queryKeys.instructorExperience.detail(id),
        }),
      ]),
  });
}

export function useDeleteInstructorExperience() {
  const client = useQueryClient();
  return useGuardedMutation({
    mutationFn: (id: number, auth) => instructorExperienceService.remove(id, auth),
    onSuccess: (_response, id) => {
      client.removeQueries({
        queryKey: queryKeys.instructorExperience.detail(id),
      });
      return client.invalidateQueries({
        queryKey: queryKeys.instructorExperience.lists(),
      });
    },
  });
}
