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
    // No `secret`: NextAuth reads AUTH_SECRET itself (declared on the dashboard's turbo tasks).
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
            // console.log({ result })
            if (
              tokenExpiresAt(result.access_token) <= Date.now() ||
              tokenExpiresAt(result.refresh_token) <= Date.now()
            )
              return null;
            return {
              id: String(result.user.sub),
              name: result.user.username,
              email: result.user.email,
              image: result.user.avatar,
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
      async jwt({ token, user, trigger, session }) {
        // `update({ user })` on the client copies the changed profile fields
        // into the session cookie; no backend request is made.
        if (trigger === "update" && session?.user) {
          const { name, email, image } = session.user;
          if (typeof name === "string") token.name = name;
          if (typeof email === "string") token.email = email;
          if (typeof image === "string" || image === null) token.picture = image;
        }
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
        session.user.name = token.name;
        session.user.email = token.email ?? "";
        session.user.image = token.picture;
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
