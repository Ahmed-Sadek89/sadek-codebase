import { apiClient } from "@repo/libs/axios";
import type {
  AuthorizedRequest,
  ChangePasswordRequest,
  ChangePasswordResponse,
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
} as const;

export const authService = {
  async login(request: LoginRequest): Promise<LoginResponse> {
    const { data } = await apiClient.post<LoginResponse>(
      authEndpoints.login,
      request,
    );
    return data;
  },
  async refresh({ refreshToken }: RefreshRequest): Promise<RefreshResponse> {
    const { data } = await apiClient.post<RefreshResponse>(
      authEndpoints.refresh,
      undefined,
      {
        headers: { Authorization: `Bearer ${refreshToken}` },
      },
    );
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
  async logout({ accessToken }: LogoutRequest): Promise<LogoutResponse> {
    const { data } = await apiClient.post<LogoutResponse>(
      authEndpoints.logout,
      undefined,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );
    return data;
  },
};
