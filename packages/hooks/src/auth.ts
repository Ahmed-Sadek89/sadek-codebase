"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
} from "@repo/libs/query";
import { authService } from "@repo/services/auth";
import { queryKeys } from "@repo/utils/query-keys";
import type {
  AuthSession,
  ChangePasswordRequest,
  ChangePasswordResponse,
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  RefreshResponse,
} from "@repo/types/auth";
import { useGuardedQuery } from "./api";

function requireSession(client: QueryClient): AuthSession {
  const session = client.getQueryData<AuthSession | null>(
    queryKeys.auth.session(),
  );
  if (!session)
    throw new Error("Sign in before making an authenticated request.");
  return session;
}

function removeUserQueries(client: QueryClient) {
  // Keep session observers attached so mounted consumers see login/logout.
  client.removeQueries({
    predicate: (query) =>
      query.queryKey[0] !== "auth" || query.queryKey[1] !== "session",
  });
}

/**
 * GET /auth/me: the signed-in user's profile, using the NextAuth session's
 * access token. Login and logout drop it with the other user queries.
 */
export function useMe() {
  return useGuardedQuery({
    queryKey: queryKeys.auth.me(),
    queryFn: (auth) => authService.me(auth),
  });
}

/** Observes the in-memory session; it makes no network request (see `useMe`). */
export function useAuthSession() {
  return useQuery<AuthSession | null>({
    queryKey: queryKeys.auth.session(),
    queryFn: () => null,
    initialData: null,
    enabled: false,
  });
}

export function useLogin() {
  const client = useQueryClient();
  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationKey: queryKeys.auth.login(),
    mutationFn: (request) => authService.login(request),
    onSuccess: (session) => {
      // Discard any cached data belonging to a previous user.
      removeUserQueries(client);
      client.setQueryData<AuthSession>(queryKeys.auth.session(), session);
    },
  });
}

export function useRefreshToken() {
  const client = useQueryClient();
  return useMutation<RefreshResponse, Error, void>({
    mutationKey: queryKeys.auth.refresh(),
    mutationFn: async () => {
      const session = requireSession(client);
      const response = await authService.refresh({
        refreshToken: session.refresh_token,
      });
      // Do not resurrect a session if logout or another login occurred meanwhile.
      if (client.getQueryData(queryKeys.auth.session()) === session) {
        client.setQueryData<AuthSession>(queryKeys.auth.session(), {
          ...session,
          ...response,
        });
      }
      return response;
    },
  });
}

export function useChangePassword() {
  const client = useQueryClient();
  return useMutation<ChangePasswordResponse, Error, ChangePasswordRequest>({
    mutationKey: queryKeys.auth.changePassword(),
    mutationFn: (request) =>
      authService.changePassword(request, {
        accessToken: requireSession(client).access_token,
      }),
  });
}

export function useLogout() {
  const client = useQueryClient();
  return useMutation<LogoutResponse, Error, void>({
    mutationKey: queryKeys.auth.logout(),
    mutationFn: async () => {
      const session = requireSession(client);
      const response = await authService.logout({
        accessToken: session.access_token,
      });
      if (client.getQueryData(queryKeys.auth.session()) === session) {
        removeUserQueries(client);
        client.setQueryData(queryKeys.auth.session(), null);
      }
      return response;
    },
  });
}
