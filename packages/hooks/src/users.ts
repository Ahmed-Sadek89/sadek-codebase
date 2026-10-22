"use client";

import { keepPreviousData, useQueryClient } from "@repo/libs/query";
import { usersService } from "@repo/services/users";
import type {
  CreateUserRequest,
  UpdateUserDefaultViewRequest,
  UpdateUserRequest,
  UsersQuery,
} from "@repo/types/users";
import { queryKeys } from "@repo/utils/query-keys";
import { useGuardedMutation, useGuardedQuery, usePublicMutation } from "./api";

/** GET /users: every user, paginated and searchable (not scoped to the signed-in user). */
export function useUsers(query: UsersQuery = {}) {
  return useGuardedQuery({
    queryKey: queryKeys.users.list(query),
    queryFn: (auth) => usersService.findAll(query, auth),
    // Keep the current rows on screen while a new page or search loads.
    placeholderData: keepPreviousData,
  });
}

/** GET /users/:id */
export function useUser(id: number | undefined) {
  return useGuardedQuery({
    queryKey: queryKeys.users.detail(id ?? 0),
    queryFn: (auth) => usersService.findOne(id!, auth),
    enabled: id !== undefined,
  });
}

/** GET /users/email?email=: `null` when no user has that email. */
export function useUserByEmail(email: string | undefined) {
  return useGuardedQuery({
    queryKey: queryKeys.users.byEmail(email ?? ""),
    queryFn: (auth) => usersService.findOneByEmail(email!, auth),
    enabled: Boolean(email),
  });
}

/** POST /users (public sign-up). */
export function useCreateUser() {
  const client = useQueryClient();
  return usePublicMutation({
    mutationFn: (request: CreateUserRequest) => usersService.create(request),
    onSuccess: () =>
      Promise.all([
        client.invalidateQueries({ queryKey: queryKeys.users.lists() }),
        client.invalidateQueries({ queryKey: queryKeys.users.byEmails() }),
      ]),
  });
}

/** PATCH /users/:id; also refreshes GET /auth/me, which may be the same user. */
export function useUpdateUser() {
  const client = useQueryClient();
  return useGuardedMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateUserRequest }, auth) =>
      usersService.update(id, data, auth),
    onSuccess: (_response, { id }) =>
      Promise.all([
        client.invalidateQueries({ queryKey: queryKeys.users.lists() }),
        client.invalidateQueries({ queryKey: queryKeys.users.detail(id) }),
        client.invalidateQueries({ queryKey: queryKeys.users.byEmails() }),
        client.invalidateQueries({ queryKey: queryKeys.auth.me() }),
      ]),
  });
}

/**
 * PATCH /users/:id/default-view; setting `true` also flips the previous
 * default-view user to `false`, so every user query is refreshed.
 */
export function useUpdateUserDefaultView() {
  const client = useQueryClient();
  return useGuardedMutation({
    mutationFn: (
      { id, data }: { id: number; data: UpdateUserDefaultViewRequest },
      auth,
    ) => usersService.updateDefaultView(id, data, auth),
    onSuccess: () =>
      Promise.all([
        client.invalidateQueries({ queryKey: queryKeys.users.all }),
        client.invalidateQueries({ queryKey: queryKeys.auth.me() }),
        // The /public routes show the default-view user's data, so they all change.
        client.invalidateQueries({ queryKey: queryKeys.userInfo.public() }),
        ...[
          queryKeys.categorySkills,
          queryKeys.categoryProjects,
          queryKeys.projects,
          queryKeys.userCompany,
          queryKeys.whatCanDo,
        ].map((keys) =>
          client.invalidateQueries({ queryKey: keys.publicLists() }),
        ),
      ]),
  });
}

export function useDeleteUser() {
  const client = useQueryClient();
  return useGuardedMutation({
    mutationFn: (id: number, auth) => usersService.remove(id, auth),
    onSuccess: (_response, id) => {
      client.removeQueries({ queryKey: queryKeys.users.detail(id) });
      return Promise.all([
        client.invalidateQueries({ queryKey: queryKeys.users.lists() }),
        client.invalidateQueries({ queryKey: queryKeys.users.byEmails() }),
      ]);
    },
  });
}
