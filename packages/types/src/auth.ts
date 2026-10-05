export interface LoginRequest {
  email: string;
  password: string;
}

/** The backend returns the JWT subject as `sub`, not `id` or `userId`. */
export interface AuthUser {
  sub: number;
  email: string;
}

export interface LoginResponse {
  user: AuthUser;
  access_token: string;
  refresh_token: string;
}

/** Sent as a Bearer header, not in the request body. */
export interface RefreshRequest {
  refreshToken: string;
}

export interface RefreshResponse {
  access_token: string;
}

export interface ChangePasswordRequest extends LoginRequest {
  newPassword: string;
  confirmPassword: string;
}

export interface AuthorizedRequest {
  accessToken: string;
}

export interface MessageResponse {
  message: string;
}

export type ChangePasswordResponse = MessageResponse;
export type LogoutRequest = AuthorizedRequest;
export type LogoutResponse = MessageResponse;
export type AuthSession = LoginResponse;

export interface ApiErrorResponse {
  statusCode: number;
  message: string | string[];
  error?: string;
}
