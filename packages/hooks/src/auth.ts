"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
} from "@repo/libs/query";
import { authService } from "@repo/services/auth";
import type {
  AuthSession,
  ChangePasswordRequest,
  ChangePasswordResponse,
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  RefreshResponse,
} from "@repo/types/auth";

export const authKeys = {
  session: ["auth", "session"] as const,
  login: ["auth", "login"] as const,
  refresh: ["auth", "refresh"] as const,
  changePassword: ["auth", "change-password"] as const,
  logout: ["auth", "logout"] as const,
};

function requireSession(client: QueryClient): AuthSession {
  const session = client.getQueryData<AuthSession | null>(authKeys.session);
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

/** Observes the in-memory session; the backend has no session/me endpoint. */
export function useAuthSession() {
  return useQuery<AuthSession | null>({
    queryKey: authKeys.session,
    queryFn: () => null,
    initialData: null,
    enabled: false,
  });
}

export function useLogin() {
  const client = useQueryClient();
  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationKey: authKeys.login,
    mutationFn: authService.login,
    onSuccess: (session) => {
      // Discard any cached data belonging to a previous user.
      removeUserQueries(client);
      client.setQueryData<AuthSession>(authKeys.session, session);
    },
  });
}

export function useRefreshToken() {
  const client = useQueryClient();
  return useMutation<RefreshResponse, Error, void>({
    mutationKey: authKeys.refresh,
    mutationFn: async () => {
      const session = requireSession(client);
      const response = await authService.refresh({
        refreshToken: session.refresh_token,
      });
      // Do not resurrect a session if logout or another login occurred meanwhile.
      if (client.getQueryData(authKeys.session) === session) {
        client.setQueryData<AuthSession>(authKeys.session, {
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
    mutationKey: authKeys.changePassword,
    mutationFn: (request) =>
      authService.changePassword(request, {
        accessToken: requireSession(client).access_token,
      }),
  });
}

export function useLogout() {
  const client = useQueryClient();
  return useMutation<LogoutResponse, Error, void>({
    mutationKey: authKeys.logout,
    mutationFn: async () => {
      const session = requireSession(client);
      const response = await authService.logout({
        accessToken: session.access_token,
      });
      if (client.getQueryData(authKeys.session) === session) {
        removeUserQueries(client);
        client.setQueryData(authKeys.session, null);
      }
      return response;
    },
  });
}
