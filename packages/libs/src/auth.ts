import NextAuth, { type NextAuthResult, type DefaultSession } from "next-auth";
import type { } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import { tokenExpiresAt, refreshTokens, type AuthService } from "./auth-tokens";

// Refresh tokens stay inside the encrypted HttpOnly session cookie.
declare module "next-auth" {
  interface User {
    accessToken?: string;
    refreshToken?: string;
  }
  interface Session {
    accessToken?: string;
    accessTokenExpires?: number;
    refreshTokenExpires?: number;
    user: { id: string } & DefaultSession["user"];
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    refreshTokenExpires?: number;
  }
}

export function createAuth(
  backendUrl: string,
  authService: AuthService,
  cookiePrefix: string,
): NextAuthResult {
  const requestConfig = { baseURL: backendUrl.replace(/\/$/, "") };
  return NextAuth({
    debug: process.env.NODE_ENV === "development",
    secret: process.env.AUTH_SECRET,
    basePath: "/api/session",
    pages: { signIn: "/" },
    session: { strategy: "jwt" },
    cookies: {
      sessionToken: { name: `${cookiePrefix}.session-token`, options: {} },
      callbackUrl: { name: `${cookiePrefix}.callback-url`, options: {} },
      csrfToken: { name: `${cookiePrefix}.csrf-token`, options: {} },
      pkceCodeVerifier: {
        name: `${cookiePrefix}.pkce.code_verifier`,
        options: {},
      },
      state: { name: `${cookiePrefix}.state`, options: {} },
      nonce: { name: `${cookiePrefix}.nonce`, options: {} },
      webauthnChallenge: { name: `${cookiePrefix}.challenge`, options: {} },
    },
    providers: [
      Credentials({
        credentials: { email: {}, password: {} },
        async authorize(credentials) {
          if (
            typeof credentials.email !== "string" ||
            typeof credentials.password !== "string" ||
            !credentials.password ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email)
          )
            return null;
          try {
            const result = await authService.login(
              { email: credentials.email, password: credentials.password },
              requestConfig,
            );
            console.log({ result })
            if (
              tokenExpiresAt(result.access_token) <= Date.now() ||
              tokenExpiresAt(result.refresh_token) <= Date.now()
            )
              return null;
            return {
              id: String(result.user.sub),
              email: result.user.email,
              accessToken: result.access_token,
              refreshToken: result.refresh_token,
            };
          } catch {
            return null;
          }
        },
      }),
    ],
    callbacks: {
      async jwt({ token, user }) {
        if (user?.accessToken && user.refreshToken) {
          token.accessToken = user.accessToken;
          token.refreshToken = user.refreshToken;
          token.accessTokenExpires = tokenExpiresAt(user.accessToken);
          token.refreshTokenExpires = tokenExpiresAt(user.refreshToken);
        }
        return refreshTokens(token, requestConfig, authService);
      },
      session({ session, token }) {
        session.user.id = token.sub!;
        session.accessToken = token.accessToken;
        session.accessTokenExpires = token.accessTokenExpires;
        session.refreshTokenExpires = token.refreshTokenExpires;
        return session;
      },
    },
    events: {
      async signOut(message) {
        if (!("token" in message) || !message.token) return;
        const token = await refreshTokens(
          message.token,
          requestConfig,
          authService,
        );
        if (token?.accessToken) {
          // Always clear the local cookie, even when the backend is unavailable.
          try {
            await authService.logout(
              { accessToken: token.accessToken },
              requestConfig,
            );
          } catch {
            console.error("Backend logout failed");
          }
        }
      },
    },
  });
}
