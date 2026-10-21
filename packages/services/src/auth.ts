import { apiClient } from "@repo/libs/axios";
import type {
  AuthorizedRequest,
  ChangePasswordRequest,
  ChangePasswordResponse,
  CurrentUser,
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  LogoutResponse,
  RefreshRequest,
  RefreshResponse,
} from "@repo/types/auth";

export const authEndpoints = {
  login: "/auth/login",
  refresh: "/auth/refresh",
  changePassword: "/auth/change-password",
  logout: "/auth/logout",
  me: "/auth/me",
} as const;

export const authService = {
  async login(
    request: LoginRequest,
    config?: { baseURL: string },
  ): Promise<LoginResponse> {
    const { data } = await apiClient.post<LoginResponse>(
      authEndpoints.login,
      request,
      config,
    );
    return data;
  },
  async refresh(
    { refreshToken }: RefreshRequest,
    config?: { baseURL: string },
  ): Promise<RefreshResponse> {
    const { data } = await apiClient.post<RefreshResponse>(
      authEndpoints.refresh,
      undefined,
      {
        ...config,
        headers: { Authorization: `Bearer ${refreshToken}` },
      },
    );
    return data;
  },
  async me({ accessToken }: AuthorizedRequest): Promise<CurrentUser> {
    const { data } = await apiClient.get<CurrentUser>(authEndpoints.me, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return data;
  },
  async changePassword(
    request: ChangePasswordRequest,
    { accessToken }: AuthorizedRequest,
  ): Promise<ChangePasswordResponse> {
    const { data } = await apiClient.patch<ChangePasswordResponse>(
      authEndpoints.changePassword,
      request,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );
    return data;
  },
  async logout(
    { accessToken }: LogoutRequest,
    config?: { baseURL: string },
  ): Promise<LogoutResponse> {
    const { data } = await apiClient.post<LogoutResponse>(
      authEndpoints.logout,
      undefined,
      {
        ...config,
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );
    return data;
  },
};
