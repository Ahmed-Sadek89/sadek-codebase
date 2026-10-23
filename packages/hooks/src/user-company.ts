"use client";

import {
  keepPreviousData,
  useInfiniteQuery,
  useQueryClient,
  type QueryClient,
} from "@repo/libs/query";
import { userCompanyService } from "@repo/services/user-company";
import type {
  CreateUserCompanyRequest,
  UpdateUserCompanyRequest,
  UserCompaniesQuery,
} from "@repo/types/user-company";
import { getNextPageParam } from "@repo/utils/pagination";
import { queryKeys } from "@repo/utils/query-keys";
import { useGuardedMutation, useGuardedQuery, usePublicQuery } from "./api";

// GET /user-company/me returns the same rows as the list, so refresh both.
function invalidateUserCompanyLists(client: QueryClient) {
  return Promise.all([
    client.invalidateQueries({ queryKey: queryKeys.userCompany.lists() }),
    client.invalidateQueries({ queryKey: queryKeys.userCompany.mines() }),
  ]);
}

/** GET /user-company: the signed-in user's companies, paginated. */
export function useUserCompanies(query: UserCompaniesQuery = {}) {
  return useGuardedQuery({
    queryKey: queryKeys.userCompany.list(query),
    queryFn: (auth) => userCompanyService.findAll(query, auth),
    // Keep the current rows on screen while a new page loads.
    placeholderData: keepPreviousData,
  });
}

/** GET /user-company/public: the default-view user's companies, paginated. No sign-in needed. */
export function usePublicUserCompanies(query: UserCompaniesQuery = {}) {
  return usePublicQuery({
    queryKey: queryKeys.userCompany.publicList(query),
    queryFn: () => userCompanyService.findAllPublic(query),
    // Keep the current rows on screen while a new page or search loads.
    placeholderData: keepPreviousData,
  });
}

/**
 * GET /user-company/public, page by page: `fetchNextPage()` appends the next
 * `query.limit` companies and `hasNextPage` turns false after the last page.
 * No sign-in needed.
 */
export function useInfinitePublicUserCompanies(
  query: Omit<UserCompaniesQuery, "page"> = {},
) {
  return useInfiniteQuery({
    queryKey: queryKeys.userCompany.publicInfinite(query),
    queryFn: ({ pageParam }) =>
      userCompanyService.findAllPublic({ ...query, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam,
  });
}

/** GET /user-company/me: the signed-in user's companies, paginated by start date (latest first by default). */
export function useMyUserCompanies(query: UserCompaniesQuery = {}) {
  return useGuardedQuery({
    queryKey: queryKeys.userCompany.mine(query),
    queryFn: (auth) => userCompanyService.findMine(query, auth),
    placeholderData: keepPreviousData,
  });
}

/** GET /user-company/:id */
export function useUserCompany(id: number | undefined) {
  return useGuardedQuery({
    queryKey: queryKeys.userCompany.detail(id ?? 0),
    queryFn: (auth) => userCompanyService.findOne(id!, auth),
    enabled: id !== undefined,
  });
}

export function useCreateUserCompany() {
  const client = useQueryClient();
  return useGuardedMutation({
    mutationFn: (request: CreateUserCompanyRequest, auth) =>
      userCompanyService.create(request, auth),
    onSuccess: () => invalidateUserCompanyLists(client),
  });
}

export function useUpdateUserCompany() {
  const client = useQueryClient();
  return useGuardedMutation({
    mutationFn: (
      { id, data }: { id: number; data: UpdateUserCompanyRequest },
      auth,
    ) => userCompanyService.update(id, data, auth),
    onSuccess: (_response, { id }) =>
      Promise.all([
        invalidateUserCompanyLists(client),
        client.invalidateQueries({
          queryKey: queryKeys.userCompany.detail(id),
        }),
      ]),
  });
}

export function useDeleteUserCompany() {
  const client = useQueryClient();
  return useGuardedMutation({
    mutationFn: (id: number, auth) => userCompanyService.remove(id, auth),
    onSuccess: (_response, id) => {
      client.removeQueries({ queryKey: queryKeys.userCompany.detail(id) });
      return invalidateUserCompanyLists(client);
    },
  });
}
