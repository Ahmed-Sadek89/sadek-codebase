"use client";

import {
  keepPreviousData,
  useQueryClient,
  type QueryClient,
} from "@repo/libs/query";
import { userInfoService } from "@repo/services/user-info";
import type {
  CreateUserInfoRequest,
  UpdateUserInfoRequest,
  UserInfoQuery,
} from "@repo/types/user-info";
import { queryKeys } from "@repo/utils/query-keys";
import { useGuardedMutation, useGuardedQuery, usePublicQuery } from "./api";

// GET /user-info/me returns the same rows as the list, so refresh both.
function invalidateUserInfoLists(client: QueryClient) {
  return Promise.all([
    client.invalidateQueries({ queryKey: queryKeys.userInfo.lists() }),
    client.invalidateQueries({ queryKey: queryKeys.userInfo.mine() }),
  ]);
}

/** GET /user-info: every user's row, paginated. */
export function useUserInfos(query: UserInfoQuery = {}) {
  return useGuardedQuery({
    queryKey: queryKeys.userInfo.list(query),
    queryFn: (auth) => userInfoService.findAll(query, auth),
    // Keep the current rows on screen while a new page loads.
    placeholderData: keepPreviousData,
  });
}

/** GET /user-info/public: the default-view user's info, paginated. No sign-in needed. */
export function usePublicUserInfos(query: UserInfoQuery = {}) {
  return usePublicQuery({
    queryKey: queryKeys.userInfo.publicList(query),
    queryFn: () => userInfoService.findAllPublic(query),
    // Keep the current rows on screen while a new page or search loads.
    placeholderData: keepPreviousData,
  });
}

/** GET /user-info/me: the signed-in user's row (404 until they create it). */
export function useMyUserInfo() {
  return useGuardedQuery({
    queryKey: queryKeys.userInfo.mine(),
    queryFn: (auth) => userInfoService.findMine(auth),
  });
}

/** GET /user-info/:id */
export function useUserInfo(id: number | undefined) {
  return useGuardedQuery({
    queryKey: queryKeys.userInfo.detail(id ?? 0),
    queryFn: (auth) => userInfoService.findOne(id!, auth),
    enabled: id !== undefined,
  });
}

export function useCreateUserInfo() {
  const client = useQueryClient();
  return useGuardedMutation({
    mutationFn: (request: CreateUserInfoRequest, auth) =>
      userInfoService.create(request, auth),
    onSuccess: () => invalidateUserInfoLists(client),
  });
}

export function useUpdateUserInfo() {
  const client = useQueryClient();
  return useGuardedMutation({
    mutationFn: (
      { id, data }: { id: number; data: UpdateUserInfoRequest },
      auth,
    ) => userInfoService.update(id, data, auth),
    onSuccess: (_response, { id }) =>
      Promise.all([
        invalidateUserInfoLists(client),
        client.invalidateQueries({ queryKey: queryKeys.userInfo.detail(id) }),
      ]),
  });
}

export function useDeleteUserInfo() {
  const client = useQueryClient();
  return useGuardedMutation({
    mutationFn: (id: number, auth) => userInfoService.remove(id, auth),
    onSuccess: (_response, id) => {
      client.removeQueries({ queryKey: queryKeys.userInfo.detail(id) });
      return invalidateUserInfoLists(client);
    },
  });
}
