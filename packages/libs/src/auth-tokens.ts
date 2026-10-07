import type {
  LoginRequest,
  LoginResponse,
  RefreshRequest,
  RefreshResponse,
  LogoutRequest,
  LogoutResponse,
} from "@repo/types/auth";

export interface AuthService {
  login(
    request: LoginRequest,
    config?: { baseURL: string },
  ): Promise<LoginResponse>;
  refresh(
    request: RefreshRequest,
    config?: { baseURL: string },
  ): Promise<RefreshResponse>;
  logout(
    request: LogoutRequest,
    config?: { baseURL: string },
  ): Promise<LogoutResponse>;
}

/** Decode only expiry metadata; the backend verifies token signatures. */
export function tokenExpiresAt(token: string): number {
  const payload = JSON.parse(
    Buffer.from(token.split(".")[1] ?? "", "base64url").toString(),
  ) as { exp?: number };
  if (!Number.isFinite(payload.exp))
    throw new Error("Token has no valid expiry");
  return payload.exp! * 1000;
}
export interface BackendTokens {
  accessToken?: string;
  refreshToken?: string;
  accessTokenExpires?: number;
  refreshTokenExpires?: number;
}

export async function refreshTokens<T extends BackendTokens>(
  token: T,
  requestConfig: { baseURL: string },
  authService: Pick<AuthService, "refresh">,
  now = Date.now(),
): Promise<T | null> {
  if (
    !token.refreshToken ||
    !token.refreshTokenExpires ||
    now >= token.refreshTokenExpires
  ) {
    console.log("NO REFRESH TOKEN OR REFRESH TOKEN EXPIRED", token);
    return null;
  }
  if (
    !token.accessToken ||
    typeof token.accessTokenExpires !== "number" ||
    !Number.isFinite(token.accessTokenExpires)
  )
    return null;
  // Invoke the refresh request only after the current access token expires.
  if (now < token.accessTokenExpires) return token;
  try {
    const result = await authService.refresh(
      { refreshToken: token.refreshToken },
      requestConfig,
    );
    console.log("TOKEN REFRESHED", result);
    const accessToken = result.access_token;
    const accessTokenExpires = tokenExpiresAt(accessToken);
    if (
      accessTokenExpires <= Date.now() ||
      token.refreshTokenExpires <= Date.now()
    )
      return null;
    return { ...token, accessToken, accessTokenExpires };
  } catch {
    return null;
  }
}
