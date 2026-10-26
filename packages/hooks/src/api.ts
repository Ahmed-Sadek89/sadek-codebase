"use client";

import { getSession, signOut, useSession } from "next-auth/react";
import {
  useMutation,
  useQuery,
  type QueryKey,
  type UseMutationOptions,
  type UseQueryOptions,
} from "@repo/libs/query";
import type { AuthorizedRequest } from "@repo/types/auth";
// Type-only: brings in the Session.accessToken augmentation without server code.
import type {} from "@repo/libs/auth";
import { withAuthRetry } from "./auth-retry";

const SIGNED_OUT_ERROR = "Sign in before making an authenticated request.";

/**
 * Re-reads the session for a retry after a 401: the server's jwt callback
 * refreshes an expired access token, saves the cookie and updates useSession.
 */
async function getFreshToken() {
  return (await getSession())?.accessToken;
}

/** No usable token after a 401 (refresh token expired or revoked): back to sign-in. */
function signOutToLogin() {
  return signOut({ redirectTo: "/" });
}

// ---------------------------------------------------------------------------
// Guarded endpoints: the NextAuth session's access token is injected for you.
// ---------------------------------------------------------------------------

export type GuardedQueryOptions<
  TData,
  TQueryKey extends QueryKey = QueryKey,
> = Omit<UseQueryOptions<TData, Error, TData, TQueryKey>, "queryFn"> & {
  queryFn: (auth: AuthorizedRequest) => Promise<TData>;
};

export type GuardedMutationOptions<TData, TVariables = void> = Omit<
  UseMutationOptions<TData, Error, TVariables>,
  "mutationFn"
> & {
  mutationFn: (
    variables: TVariables,
    auth: AuthorizedRequest,
  ) => Promise<TData>;
};

/** The current access token; NextAuth refreshes it before it expires. */
function useAccessToken() {
  return useSession().data?.accessToken;
}

/**
 * Waits for a session, then calls `queryFn` with `{ accessToken }`. A 401 is
 * retried once with a refreshed token (see withAuthRetry).
 */
export function useGuardedQuery<TData, TQueryKey extends QueryKey = QueryKey>({
  queryFn,
  enabled,
  ...options
}: GuardedQueryOptions<TData, TQueryKey>) {
  const accessToken = useAccessToken();

  return useQuery({
    ...options,
    // The token is left out of the key so a refresh does not refetch everything.
    queryFn: () => {
      if (!accessToken) throw new Error(SIGNED_OUT_ERROR);
      return withAuthRetry(
        (token) => queryFn({ accessToken: token }),
        accessToken,
        getFreshToken,
        signOutToLogin,
      );
    },
    enabled: (query) =>
      Boolean(accessToken) &&
      (typeof enabled === "function" ? enabled(query) : (enabled ?? true)),
  });
}

/**
 * Calls `mutationFn` with the variables and `{ accessToken }`; rejects when
 * signed out. A 401 is retried once with a refreshed token.
 */
export function useGuardedMutation<TData, TVariables = void>({
  mutationFn,
  ...options
}: GuardedMutationOptions<TData, TVariables>) {
  const accessToken = useAccessToken();

  return useMutation({
    ...options,
    mutationFn: (variables: TVariables) => {
      if (!accessToken) return Promise.reject(new Error(SIGNED_OUT_ERROR));
      return withAuthRetry(
        (token) => mutationFn(variables, { accessToken: token }),
        accessToken,
        getFreshToken,
        signOutToLogin,
      );
    },
  });
}

// ---------------------------------------------------------------------------
// Public endpoints: same shape, no token.
// ---------------------------------------------------------------------------

export type PublicQueryOptions<
  TData,
  TQueryKey extends QueryKey = QueryKey,
> = Omit<UseQueryOptions<TData, Error, TData, TQueryKey>, "queryFn"> & {
  queryFn: () => Promise<TData>;
};

export type PublicMutationOptions<TData, TVariables = void> = Omit<
  UseMutationOptions<TData, Error, TVariables>,
  "mutationFn"
> & {
  mutationFn: (variables: TVariables) => Promise<TData>;
};

export function usePublicQuery<TData, TQueryKey extends QueryKey = QueryKey>({
  queryFn,
  ...options
}: PublicQueryOptions<TData, TQueryKey>) {
  return useQuery({ ...options, queryFn: () => queryFn() });
}

export function usePublicMutation<TData, TVariables = void>({
  mutationFn,
  ...options
}: PublicMutationOptions<TData, TVariables>) {
  return useMutation({
    ...options,
    mutationFn: (variables: TVariables) => mutationFn(variables),
  });
}
