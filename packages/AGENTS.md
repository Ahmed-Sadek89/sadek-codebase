# Shared workspace packages

These instructions apply to `packages/` alongside the repository's `AGENTS.md`. All paths are relative to the repository root.

## Package responsibilities

| Folder                       | Package name              | Purpose and public imports                                                                                                                                                                  |
| ---------------------------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `packages/types`             | `@repo/types`             | Shared API request/response contracts. Use type-only imports from `@repo/types/auth` or `@repo/types`. No runtime dependencies.                                                             |
| `packages/libs`              | `@repo/libs`              | Axios instance and error formatting at `@repo/libs/axios`; TanStack Query configuration and hooks at `@repo/libs/query`; QueryClient factory at `@repo/libs/query`.                     |
| `packages/services`          | `@repo/services`          | Typed HTTP endpoint functions using the Axios client from libs and contracts from types. Auth is exported through `@repo/services/auth` or `@repo/services`.                              |
| `packages/hooks`             | `@repo/hooks`             | Client React hooks using services, types, and the QueryClient supplied by libs. Auth hooks are exported through `@repo/hooks/auth` or `@repo/hooks`.                                        |
| `packages/ui`                | `@repo/ui`                | Shared shadcn primitives, theme tokens, icons, and utilities. Import components through `@repo/ui/<component>`, styles through `@repo/ui/global.css`, and helpers through `@repo/ui/utils`. |
| `packages/eslint-config`     | `@repo/eslint-config`     | Shared ESLint flat configs: `@repo/eslint-config/base`, `@repo/eslint-config/next-js`, and `@repo/eslint-config/react-internal`.                                                            |
| `packages/typescript-config` | `@repo/typescript-config` | Shared `base.json`, `react-library.json`, and `nextjs.json` TypeScript configurations.                                                                                                      |

## Dependency direction and usage

Keep dependencies acyclic: types are independent; libs use types; services use libs and types; hooks use services, libs, and types; apps consume these packages. Keep HTTP details in services, reusable API hooks in hooks, client configuration in libs, and page form schemas inside the app.

Declare workspace dependencies as `"workspace:*"` in the consuming package's `package.json`. Import through exported package names, never relative paths into another package. Verify public paths against that package's `exports`. These packages export TypeScript source and do not require a separate build step; their consumers must support TypeScript source imports.

```tsx
import type { LoginRequest, LoginResponse } from "@repo/types/auth";
import { apiClient, getApiErrorMessage } from "@repo/libs/axios";
import { QueryProvider } from "@repo/provider/query-provider";
import { authService } from "@repo/services/auth";
import { useLogin, useAuthSession } from "@repo/hooks/auth";
```

Wrap the consuming app in `QueryProvider` before using API hooks. `libs` creates a fresh QueryClient on the server and keeps a stable client in the browser. Query defaults: one query retry and no focus refetch; mutations do not retry. Do not set `gcTime` or `staleTime` anywhere in `packages/*`, including QueryClient defaults, query-specific defaults, and hooks; use TanStack Query's built-in timing defaults. Auth session data uses the in-memory query cache and its default garbage collection; it is not persisted to browser storage or cookies.

The shared Axios instance reads its base URL from `process.env.NEXT_PUBLIC_BACKEND_URL`, falls back to `/api` when unset or empty, and uses JSON requests. Configure this public backend URL in the consuming app's environment before starting or building it; shared packages do not load their own `.env` files. Keep direct `process.env.NEXT_PUBLIC_BACKEND_URL` access so Next.js can inline it in browser bundles. With an absolute backend URL, the backend must allow the app origin through CORS. When using the `/api` fallback, apps must proxy that prefix to their backend. Pass auth tokens per request; do not put user tokens in shared Axios defaults or a server-global cache. `getApiErrorMessage` handles Nest's string/array errors and network failures without exposing request credentials.

## Auth API contracts

The source of truth is `apps/sadek-backend/src/auth`: controller, DTOs, service, and JWT strategies. Do not invent unsupported endpoints or response fields.

| Backend endpoint              | Request                                                                           | Response                                                | Service / hook                                     |
| ----------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------- | -------------------------------------------------- |
| `POST /auth/login`            | JSON `{ email, password }`                                                        | `{ user: { sub, email }, access_token, refresh_token }` | `authService.login` / `useLogin`                   |
| `POST /auth/refresh`          | Refresh token in `Authorization: Bearer ...`; no body                             | `{ access_token }`                                      | `authService.refresh` / `useRefreshToken`          |
| `PATCH /auth/change-password` | Access Bearer token plus JSON `{ email, password, newPassword, confirmPassword }` | `{ message }`                                           | `authService.changePassword` / `useChangePassword` |
| `POST /auth/logout`           | Access token in `Authorization: Bearer ...`; no body                              | `{ message }`                                           | `authService.logout` / `useLogout`                 |

- The login user's identifier is `sub`, matching the backend payload.
- `useLogin().mutateAsync(credentials)` stores the returned session and clears previous-user caches on success.
- `useAuthSession()` observes the cached session. There is no backend `/me` endpoint; this hook does not make a network request.
- `useRefreshToken().mutateAsync()` reads the cached refresh token and updates only the access token. Refresh is explicit, not an automatic Axios retry interceptor. Failed refresh leaves the session unchanged and returns an error to the caller.
- `useChangePassword().mutateAsync(body)` reads the cached access token. The backend requires new passwords of 8–32 characters with uppercase, lowercase, number, and one of `@$!%*?&`, plus matching confirmation. Page forms must validate these requirements when built.
- `useLogout().mutateAsync()` calls the backend before clearing the local session and caches. Failed logout leaves the session unchanged and returns an error to the caller.
- Refresh and logout require a cached login session. Their completion must not replace or clear a different session created while a request was running.
- These hooks and the provider are client code; services and types do not depend on React hooks.
- The dashboard proxies `/api/auth/:path*` to `BACKEND_URL/auth/:path*`, defaulting to `http://localhost:4000`. Set `BACKEND_URL` in dashboard environment configuration for another backend and restart/rebuild. This avoids needing browser CORS changes in the backend.
- Dashboard login redirects only after successful authentication; request errors remain visible in the form. The dashboard now uses the NextAuth authentication described below, with server and client route guards.

## External packages used

- `provider`: `@tanstack/react-query-devtools` supplies the query inspector inside `QueryProvider`, rendered only when `process.env.NODE_ENV === "development"` and initially closed. Keep it inside the shared provider and use the standard package entry point; do not enable its production entry point.
- `libs`: `axios` provides the HTTP client; `@tanstack/react-query` provides QueryClient, the provider, and query/mutation hooks; `react` provides the React runtime.
- `hooks`: `react` is the client runtime; TanStack Query is consumed through `@repo/libs/query`, not a separately configured client.
- `types` has no runtime dependencies; services uses libs and shared API types.
- `ui`: `react` and `react-dom` provide rendering; `radix-ui` supplies accessible primitives; `vaul` supplies drawers; `next-themes` provides themes; `lucide-react` supplies icons; `class-variance-authority` supplies variants; `clsx` and `tailwind-merge` implement class merging. `cn` is also declared in the package manifest. Tailwind CSS provides token-based styling through `global.css`.
- `eslint-config`: `@eslint/js`, `eslint`, `eslint-config-prettier`, `eslint-plugin-only-warn`, `eslint-plugin-react-hooks`, `eslint-plugin-turbo`, `@next/eslint-plugin-next`, and `globals` supply shared lint rules and environments. `@babel/core`, `@babel/eslint-parser`, and `@babel/preset-typescript` parse TypeScript.
- Shared package tooling uses `typescript`, `eslint`, `@types/node`, and React type packages where needed. `typescript-config` has no runtime dependencies.
- Dashboard form dependencies (`react-hook-form`, `zod`, and `@hookform/resolvers`) are documented in `apps/dashboard/AGENTS.md`; they are app dependencies, not dependencies of these new shared packages.

## Maintenance and verification

- Update this document in the same change when introducing, using, changing, or removing a workspace or third-party package. Record its purpose, owner, public import paths, and any relevant setup. Update consuming apps' `AGENTS.md` files when their dependency usage changes.
- Keep request and response types aligned with the backend, including Bearer token conventions and error responses. Add services and hooks only for endpoints that exist or are part of the requested change.
- Reuse `packages/ui/src/global.css` tokens for UI; do not introduce hardcoded colors or gradients in shared components.
- Run `pnpm --filter @repo/libs --filter @repo/types --filter @repo/services --filter @repo/hooks check-types` and the equivalent `lint` command after changes. Also check affected consuming apps.
- Run `pnpm --filter @repo/libs --filter @repo/services test` for QueryClient isolation/defaults and auth HTTP contract tests. Tests use a mocked Axios adapter and do not need a database or real credentials.
- Follow root Turborepo instructions before changing tasks. The installed Turbo package currently lacks the requested bundled `dashboard/` docs; inspect its installed schema and official documentation when necessary. `BACKEND_URL` and `NEXT_PUBLIC_BACKEND_URL` are declared for dashboard build/dev tasks.

## Dashboard NextAuth authentication

- `next-auth` v5 (currently beta) is owned by `@repo/libs` and dashboard. `@repo/libs/auth` exports `createAuth(backendUrl, authService)` for server-only use; dashboard `auth.ts` exports handlers, auth, signIn, and signOut. Libs delegates login, refresh, and logout to `@repo/services/auth`, passing the server backend URL per request. Libs owns the Axios client at `@repo/libs/axios`. The dashboard passes `authService` into `createAuth`; libs uses a typed service interface and does not import services, keeping the package graph acyclic.
- Dashboard login now uses `signIn("credentials")` from `next-auth/react`, replacing its use of the in-memory login hook. Other shared query hooks retain their existing independent behavior.
- NextAuth uses `/api/session`, leaving `/api/auth` for the backend proxy. SessionProvider polls every 30 seconds and refetches on focus; session checks refresh expired access tokens. JWT `exp` claims control access and refresh expiry. Refresh preserves the original refresh token because the backend returns only access_token. Expired refresh tokens and failed refresh discard the entire auth JWT and both backend tokens on the next session check. The refresh token is never included in browser session JSON.
- Logout calls the backend with a valid access token where possible and clears the local session even on backend failure. Dashboard has server and client session guards and a sign-out button.
- Configure `AUTH_SECRET` (strong random secret), `AUTH_URL` (dashboard URL with `/api/session`), and `BACKEND_URL`. Set `AUTH_TRUST_HOST=true` only with a trusted deployment proxy. These server variables are passed through dashboard Turbo tasks.

## Shared session provider

- `packages/provider` (`@repo/provider`) owns the client `SessionProvider`, exported from `@repo/provider/session-provider`. It wraps `next-auth/react` with `/api/session`, 30-second polling, and refetch on window focus. Wrap app content in this provider to use client NextAuth sessions.
- The package uses `next-auth` and React, with Next.js supplied by its consuming app as a peer dependency. It uses the shared ESLint and TypeScript configurations and exports TypeScript source.

- `@repo/provider/query-provider` exports `QueryProvider`, using `getQueryClient` from `@repo/libs/query`. Provider owns the TanStack Query provider and development-only devtools dependencies; libs retains QueryClient configuration and hooks.
