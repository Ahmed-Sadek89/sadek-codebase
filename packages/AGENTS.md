# Shared workspace packages

These instructions apply to `packages/` alongside the repository's `AGENTS.md`. All paths are relative to the repository root.

## Package responsibilities

| Folder                       | Package name              | Purpose and public imports                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ---------------------------- | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `packages/types`             | `@repo/types`             | Shared API request/response contracts. Use type-only imports from `@repo/types/auth`, `@repo/types/common` (pagination, `NamedRef`), `@repo/types/category-skills`, `@repo/types/skills`, `@repo/types/category-projects`, `@repo/types/projects`, `@repo/types/user-info`, `@repo/types/user-company`, `@repo/types/what-can-do`, `@repo/types/users`, or `@repo/types`. No runtime dependencies.                                                                                                                                                                |
| `packages/libs`              | `@repo/libs`              | Axios instance and error formatting at `@repo/libs/axios`; TanStack Query configuration, hooks, SSR hydration helpers (`dehydrate`, `HydrationBoundary`), `keepPreviousData`, and option types (`QueryKey`, `UseQueryOptions`, `UseMutationOptions`) at `@repo/libs/query`; server-only NextAuth factory at `@repo/libs/auth`.                                                                                                                                                                                                                                    |
| `packages/services`          | `@repo/services`          | Typed HTTP endpoint functions using the Axios client from libs and contracts from types. Exported through `@repo/services/auth`, `@repo/services/category-skills`, `@repo/services/skills`, `@repo/services/category-projects`, `@repo/services/projects`, `@repo/services/user-info`, `@repo/services/user-company`, `@repo/services/what-can-do`, `@repo/services/users`, or `@repo/services`. Guarded services take `{ accessToken }` (`AuthorizedRequest`) as their last argument and build the Bearer header with the internal `src/auth-headers.ts` helper. |
| `packages/hooks`             | `@repo/hooks`             | Client React hooks using services, types, and the QueryClient supplied by libs. Exported through `@repo/hooks/auth`, `@repo/hooks/api` (guarded/public query wrappers), `@repo/hooks/category-skills`, `@repo/hooks/skills`, `@repo/hooks/category-projects`, `@repo/hooks/projects`, `@repo/hooks/user-info`, `@repo/hooks/user-company`, `@repo/hooks/what-can-do`, `@repo/hooks/users`, or `@repo/hooks`.                                                                                                                                                      |
| `packages/utils`             | `@repo/utils`             | Shared helpers with no React or HTTP code. `@repo/utils/query-keys` exports `queryKeys`: one nested object per hooks feature (`queryKeys.auth`, `queryKeys.categorySkills`, `queryKeys.skills`, `queryKeys.categoryProjects`, `queryKeys.projects`, `queryKeys.userInfo`, `queryKeys.userCompany`, `queryKeys.whatCanDo`, `queryKeys.users`). The file lives at `packages/utils/src/query-keys.ts`. Depends only on `@repo/types` (type-only).                                                                                                                    |
| `packages/ui`                | `@repo/ui`                | Shared shadcn primitives, theme tokens, icons, and utilities. `@repo/ui/pagination` is shadcn Pagination adapted with `label` props for translated Previous/Next/More text and RTL-flipping chevrons; `@repo/ui/button` exports `buttonVariants` and has an `icon` size (`size-9`) for it. `@repo/ui/accordion` is shadcn Accordion (`Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent`) on `radix-ui`, animated with tw-animate-css's `animate-accordion-down/up`. `@repo/ui/tabs` is shadcn Tabs (`Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`) on `radix-ui`. Import components through `@repo/ui/<component>`, styles through `@repo/ui/global.css`, and helpers through `@repo/ui/utils`.                                                                                                                                          |
| `packages/eslint-config`     | `@repo/eslint-config`     | Shared ESLint flat configs: `@repo/eslint-config/base`, `@repo/eslint-config/next-js`, and `@repo/eslint-config/react-internal`.                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `packages/typescript-config` | `@repo/typescript-config` | Shared `base.json`, `react-library.json`, and `nextjs.json` TypeScript configurations.                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |

## Dependency direction and usage

Keep dependencies acyclic: types are independent; libs and utils use types; services use libs and types; hooks use services, libs, utils, and types; apps consume these packages. Keep HTTP details in services, reusable API hooks in hooks, client configuration in libs, and page form schemas inside the app.

Declare workspace dependencies as `"workspace:*"` in the consuming package's `package.json`. Import through exported package names, never relative paths into another package. Verify public paths against that package's `exports`. These packages export TypeScript source and do not require a separate build step; their consumers must support TypeScript source imports.

```tsx
import type { LoginRequest, LoginResponse } from "@repo/types/auth";
import { apiClient, getApiErrorMessage } from "@repo/libs/axios";
import { QueryProvider } from "@repo/provider/query-provider";
import { authService } from "@repo/services/auth";
import { useLogin, useAuthSession } from "@repo/hooks/auth";
import type { CategorySkill } from "@repo/types/category-skills";
import { categorySkillsService } from "@repo/services/category-skills";
import { useGuardedQuery, usePublicQuery } from "@repo/hooks/api";
import { useCategorySkills } from "@repo/hooks/category-skills";
import { queryKeys } from "@repo/utils/query-keys";
```

All TanStack Query and mutation keys come from `queryKeys` in `@repo/utils/query-keys` (also re-exported from `@repo/hooks`). When adding hooks for a feature, add a nested object for it there instead of declaring keys inside the hook file. Follow the existing shape: an `all` root segment unique to the feature, then functions such as `lists()`, `list(query)`, `details()`, and `detail(id)` that extend it, so invalidating `all` or `lists()` clears the right entries. `queryKeys.auth.*` are functions (`queryKeys.auth.session()`), producing the same arrays the auth hooks used before.

Wrap the consuming app in `QueryProvider` before using API hooks. `libs` creates a fresh QueryClient on the server and keeps a stable client in the browser. Query defaults: one query retry and no focus refetch; mutations do not retry. Do not set `gcTime` or `staleTime` anywhere in `packages/*`, including QueryClient defaults, query-specific defaults, and hooks; use TanStack Query's built-in timing defaults. Auth session data uses the in-memory query cache and its default garbage collection; it is not persisted to browser storage or cookies.

The shared Axios instance reads its base URL from `process.env.NEXT_PUBLIC_BACKEND_URL`, falls back to `""` (same-origin relative URLs) when unset or empty, and uses JSON requests. `packages/services/tests/auth.test.ts` still expects a `/api` fallback, so its request tests fail until the code or the tests change. Configure this public backend URL in the consuming app's environment before starting or building it; shared packages do not load their own `.env` files. Keep direct `process.env.NEXT_PUBLIC_BACKEND_URL` access so Next.js can inline it in browser bundles. With an absolute backend URL, the backend must allow the app origin through CORS. When `NEXT_PUBLIC_BACKEND_URL` is unset, requests go to the app's own origin, so the app must proxy those backend paths (the dashboard proxies `/api/auth/:path*` only). Pass auth tokens per request; do not put user tokens in shared Axios defaults or a server-global cache. `getApiErrorMessage` handles Nest's string/array errors and network failures without exposing request credentials.

## Backend API endpoints

The source of truth is `apps/sadek-backend/src`: each module's controller, DTOs, service, and entity, plus the JWT strategies in `auth/`. Do not invent unsupported endpoints or response fields. Update this section in the same change whenever a backend controller route, DTO, or response shape changes, and when shared types, services, or hooks are added for an endpoint.

Rules that apply to every controller:

- There is no global route prefix; the Nest app listens on `PORT` (default `4000`). CORS allows only the comma-separated origins in the backend's `FRONTEND_URL`.
- "Guarded" means `JwtAuthGuard`: send `Authorization: Bearer <access_token>`, or the backend responds 401. "Public" routes need no token.
- The global `ValidationPipe` uses `whitelist`, `forbidNonWhitelisted`, `transform`, and implicit conversion. Unknown body or query fields are rejected with 400, so send only the documented fields. Query strings are converted to the DTO's number/boolean types.
- Paginated responses use the shared `paginate()` envelope `{ page, limit, totalPage, total, data }` (`PaginatedResponse<T>` in `@repo/types/common`). Pagination query: `page` (default 1), `limit` (default 10, max 30), and `order` `ASC`/`DESC` (default `DESC`), sorted by `createdAt`. The `/me` routes of user-company and what-can-do share their list's filter DTO (`FilterUserCompanyDto`, `FilterWhatCanDoDto`: the same fields plus `search`, but `order` has no default) and sort by their own column, keeping its natural direction when `order` is omitted.
- Entities serialize dates as ISO strings and nullable columns as `null`. Relations to the owner are reduced to `user: { id }` where selected.
- Validation and not-found failures use Nest's error body `{ statusCode, message, error? }` (`ApiErrorResponse`); `message` may be a string or a string array.
- Every list route that takes the signed-in user filters by that user.
- `GET /category-skills/public`, `/category-projects/public`, `/projects/public`, `/user-company/public`, and `/what-can-do/public` are **public** (no token) list routes. Each takes the same query DTO as its guarded list and returns the same `PaginatedResponse<T>` shape (category-skills items also embed their skills, see Category skills), scoped to the user whose `isDefaultView` is `true` (an empty page when no user is the default; see `PATCH /users/:id/default-view`). Services expose them as `findAllPublic(query)` (no `auth`), hooks as `usePublic<Entity>(query = {})` built on `usePublicQuery`, keyed by `queryKeys.<feature>.publicList(query)`. Those keys sit under `lists()`, so every mutation that invalidates a feature's lists also refreshes its public lists, and `useUpdateUserDefaultView` invalidates every feature's `publicLists()` plus `queryKeys.userInfo.public()`. `GET /user-info/public` is the exception: it returns one row, not a list (see User info). Routes noted as "no owner check" act on any id, regardless of which user owns it.

### App (`/`)

| Backend endpoint | Access | Request | Response                  | Shared client |
| ---------------- | ------ | ------- | ------------------------- | ------------- |
| `GET /`          | Public | –       | Plain text `Hello World!` | –             |

### Auth (`/auth`)

| Backend endpoint              | Request                                                                           | Response                                                                  | Service / hook                                     |
| ----------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------- | -------------------------------------------------- |
| `POST /auth/login`            | JSON `{ email, password }`                                                        | `{ user: { sub, email, username, avatar }, access_token, refresh_token }` | `authService.login` / `useLogin`                   |
| `POST /auth/refresh`          | Refresh token in `Authorization: Bearer ...`; no body                             | `{ access_token }`                                                        | `authService.refresh` / `useRefreshToken`          |
| `PATCH /auth/change-password` | Access Bearer token plus JSON `{ email, password, newPassword, confirmPassword }` | `{ message }`                                                             | `authService.changePassword` / `useChangePassword` |
| `POST /auth/logout`           | Access token in `Authorization: Bearer ...`; no body                              | `{ message }`                                                             | `authService.logout` / `useLogout`                 |
| `GET /auth/me`                | Access token in `Authorization: Bearer ...`                                       | `CurrentUser`                                                             | `authService.me` / `useMe`                         |

- The login user's identifier is `sub`, matching the backend payload. `avatar` is the user's `avatarUrl` (or `null`). `email`, `username`, and `avatar` are returned only in the login response; the access and refresh token payloads hold only `sub`, `iat`, and `exp` (`AccessTokenPayload`).
- `useLogin().mutateAsync(credentials)` stores the returned session and clears previous-user caches on success.
- `useAuthSession()` observes the cached session and makes no network request.
- `GET /auth/me` returns the user whose id is the access token's `sub` (`JwtAuthGuard`): `CurrentUser` = `{ id, username, email, avatarUrl, coverPhotoUrl, createdAt, lastLoginAt, lastLogoutAt }` (nullable: `avatarUrl`, `coverPhotoUrl`, `lastLoginAt`, `lastLogoutAt`); the password is never selected. A missing, revoked, or refresh token, or a deleted user, returns 401. `useMe()` is a guarded query (NextAuth session token via `useGuardedQuery`) under `queryKeys.auth.me()`, and `authService.me(auth)` can also be called on the server. `useLogin`/`useLogout` remove it along with every other non-session query.
- `useRefreshToken().mutateAsync()` reads the cached refresh token and updates only the access token. Refresh is explicit, not an automatic Axios retry interceptor. Failed refresh leaves the session unchanged and returns an error to the caller.
- `useChangePassword().mutateAsync(body)` is a guarded mutation: it sends the NextAuth session's access token (`useGuardedMutation`). The backend requires new passwords of 8–32 characters with uppercase, lowercase, number, and one of `@$!%*?&`, plus matching confirmation. Page forms must validate these requirements when built.
- `useLogout().mutateAsync()` calls the backend before clearing the local session and caches. Failed logout leaves the session unchanged and returns an error to the caller.
- Refresh and logout require a cached login session. Their completion must not replace or clear a different session created while a request was running.
- These hooks and the provider are client code; services and types do not depend on React hooks.
- The dashboard proxies `/api/auth/:path*` to `BACKEND_URL/auth/:path*`, defaulting to `http://localhost:4000`. Set `BACKEND_URL` in dashboard environment configuration for another backend and restart/rebuild. This avoids needing browser CORS changes in the backend.
- Dashboard login redirects only after successful authentication; request errors remain visible in the form. The dashboard now uses the NextAuth authentication described below, with server and client route guards.

### Users (`/users`)

Source: `apps/sadek-backend/src/user`. Client: types `@repo/types/users`, `usersService` / `usersEndpoints` in `@repo/services/users`, hooks in `@repo/hooks/users`, keys under `queryKeys.users`.

| Backend endpoint                | Access  | Request                                                                           | Response                                                                | Service / hook                                                |
| ------------------------------- | ------- | --------------------------------------------------------------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------- |
| `POST /users`                   | Public  | JSON `{ username, email, password, confirmPassword, avatarUrl?, coverPhotoUrl? }` | `{ message: "User created successfully" }`                              | `usersService.create` / `useCreateUser`                       |
| `GET /users`                    | Guarded | Query `page`, `limit`, `order`, `search`, `avatarUrl`, `isDefaultView`            | `PaginatedResponse<User>`                                               | `usersService.findAll` / `useUsers`                           |
| `GET /users/email?email=...`    | Guarded | Query `email`                                                                     | `{ id, username, email, password, avatarUrl, isDefaultView }` or `null` | `usersService.findOneByEmail` / `useUserByEmail`              |
| `GET /users/:id`                | Guarded | –                                                                                 | `User`                                                                  | `usersService.findOne` / `useUser`                            |
| `PATCH /users/:id`              | Guarded | JSON `{ username?, email?, avatarUrl?, coverPhotoUrl? }`                          | `{ message: "User updated successfully" }`                              | `usersService.update` / `useUpdateUser`                       |
| `PATCH /users/:id/default-view` | Guarded | JSON `{ isDefaultView }`                                                          | `{ message: "User default view updated successfully" }`                 | `usersService.updateDefaultView` / `useUpdateUserDefaultView` |
| `DELETE /users/:id`             | Guarded | –                                                                                 | `{ message: "User deleted successfully" }`                              | `usersService.remove` / `useDeleteUser`                       |

- `User` fields: `id`, `username` (unique, 3–50), `email` (unique, column max 70), `avatarUrl`, `coverPhotoUrl`, `createdAt`, `lastLoginAt`, `lastLogoutAt`, `isDefaultView` (boolean, default `false`); the images and the two last-* dates are nullable. `password` is `select: false` and never returned, except by `GET /users/email`, which returns the bcrypt hash for the sign-in lookup. `CurrentUser` in `@repo/types/auth` (`GET /auth/me`) is an alias of `User`.
- Create rules: `username` 3–50 characters; `email` must be valid; `password` 8–32 characters with lowercase, uppercase, digit, and one of `@$!%*?&`; `confirmPassword` must match; `avatarUrl`/`coverPhotoUrl` must be http(s) URLs with a TLD. Failures, including a duplicate username or email, return 400.
- `GET /users` lists every user (no owner scoping). `search` (max 20) matches `username` or `email` case-insensitively; `avatarUrl` is an exact match; `isDefaultView` (`true`/`false`) filters by the flag; `order` sorts by `createdAt` (default DESC).
- `GET /users/email` returns `null` (an empty body, normalized to `null` by the service) when no user matches.
- `GET /users/:id` returns 404 when missing. `PATCH /users/:id` strips `password`/`confirmPassword` (use `PATCH /auth/change-password`), so the client type omits them; `null` clears an image. Its not-found and duplicate errors are re-thrown as 400. `DELETE /users/:id` does not check that the row exists. No route checks that the id is the signed-in user.
- `PATCH /users/:id/default-view` is the only way to change `isDefaultView` (the create/update DTOs reject it). `true` first sets the current default-view user (if any) to `false`, then sets this user; `false` only updates this user, which can leave no default. A partial unique index (`UQ_users_is_default_view`) allows at most one `true` row. Returns 404 when the user is missing.
- Hooks: `useUsers(query = {})` keeps the previous page while loading; `useUser(id)` and `useUserByEmail(email)` are disabled until their argument is set. `useCreateUser` is a public mutation and invalidates `lists()` and `byEmails()`. `useUpdateUser` (`{ id, data }`) invalidates `lists()`, `detail(id)`, `byEmails()`, and `queryKeys.auth.me()` (the edited user may be the signed-in one). `useUpdateUserDefaultView` (`{ id, data }`) invalidates all of `queryKeys.users.all` (the previous default user changes too) and `queryKeys.auth.me()`. `useDeleteUser` (`id`) removes `detail(id)` and invalidates `lists()` and `byEmails()`.

### Category skills (`/category-skills`)

Source: `apps/sadek-backend/src/category_skills`. Types in `@repo/types/category-skills`, service `categorySkillsService` in `@repo/services/category-skills`, hooks in `@repo/hooks/category-skills`. All routes are guarded except `GET /category-skills/public`.

| Backend endpoint                       | Request                                                             | Response                                                            | Service / hook                                                    |
| -------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `POST /category-skills`                | JSON `{ nameAr, nameEn, descriptionAr?, descriptionEn?, isActive }` | Saved category (`CreateCategorySkillResponse`)                      | `categorySkillsService.create` / `useCreateCategorySkill`         |
| `GET /category-skills/private`         | Query pagination plus `search`, `isActive`                          | `PaginatedResponse<CategorySkill>`                                  | `categorySkillsService.findAll` / `useCategorySkills`             |
| `GET /category-skills/public` (Public) | Same query as `/private` | `PublicCategorySkillsResponse`: each category plus `skills`, up to 20 of its active skills (`{ id, nameAr, nameEn, createdAt }`), newest first | `categorySkillsService.findAllPublic` / `usePublicCategorySkills`, `useInfinitePublicCategorySkills` (pages via `fetchNextPage`, key `queryKeys.categorySkills.publicInfinite(query)`) |
| `GET /category-skills/:id`             | –                                                                   | `CategorySkillDetails`: category plus `skills` (linked-skill count) | `categorySkillsService.findOne` / `useCategorySkill`              |
| `PATCH /category-skills/:id`           | JSON partial of the create body                                     | `{ message }`                                                       | `categorySkillsService.update` / `useUpdateCategorySkill`         |
| `DELETE /category-skills/:id`          | –                                                                   | `{ message }`                                                       | `categorySkillsService.remove` / `useDeleteCategorySkill`         |

- Category fields: `id`, `nameAr`, `nameEn` (max 50), `descriptionAr`, `descriptionEn` (nullable), `isActive`, `createdAt`, `user: { id }`.
- The list path is `/private`, not the collection root. It returns only the signed-in user's categories, and `search` matches `nameAr` or `nameEn` (max 20 characters).
- `GET /category-skills/public` embeds skills owned by the default-view user that are active, at most 20 per category (`PUBLIC_SKILLS_PER_CATEGORY` in the service), fetched per category on the page with `SkillsService.findPublicByCategory`.
- `DELETE` returns 400 while any skill still references the category.
- `GET`, `PATCH`, and `DELETE /:id` have no owner check.
- Hooks: lists use keys `queryKeys.categorySkills.list(query)` and `placeholderData: keepPreviousData`, so the current rows stay visible while a new search loads (`isFetching` is true, `isPending` is not). Create invalidates lists; update invalidates lists, the detail, and `queryKeys.skills.all` (skills embed category names); delete removes the detail and invalidates lists.

### Skills (`/skills`)

Source: `apps/sadek-backend/src/skills`. Types in `@repo/types/skills` (`Skill`, `SavedSkill`, `SkillsQuery`, ...), service `skillsService` in `@repo/services/skills`, hooks in `@repo/hooks/skills`. All routes are guarded and scoped to the signed-in user, so another user's skill returns 404. `:id` must be an integer (`ParseIntPipe`).

| Backend endpoint              | Request                                                             | Response                                                  |
| ----------------------------- | ------------------------------------------------------------------- | --------------------------------------------------------- |
| `POST /skills`                | JSON `{ nameAr, nameEn, avatar_url?, isActive, categorySkillsIds }` | Saved skill with full `categorySkills` and `user: { id }` |
| `GET /skills`                 | Query `page`, `limit`, `order`, `search`, `isActive`, `categoryId`  | Paginated skills                                          |
| `GET /skills/:id`             | –                                                                   | Skill                                                     |
| `PATCH /skills/:id`           | JSON partial of the create body                                     | The updated skill (not a message)                         |
| `DELETE /skills/:id`          | –                                                                   | `{ message: "Skill with id <id> has been removed." }`     |

- Skill fields: `id`, `nameAr`, `nameEn` (max 50), `avatar_url` (snake_case, nullable URL), `isActive`, `createdAt`, `user: { id }`, `categorySkills: [{ id, nameAr, nameEn }]` on reads.
- `categorySkillsIds` needs at least one id, and every id must be one of the user's own skill categories, or the request returns 400. On `PATCH`, omit it to keep the current categories; an empty array returns 400.
- There is no public skills route; public skills come embedded in `GET /category-skills/public`.
- `GET /skills` filters by `isActive` and `categoryId`, search `nameAr`/`nameEn`, and sort by `createdAt` with `order`.
- Client: `skillsService.create/findAll/findOne/update/remove`; hooks `useCreateSkill`, `useSkills(query)`, `useSkill(id)`, `useUpdateSkill` (`{ id, data }`), `useDeleteSkill` (`id`). Every skill mutation invalidates skill lists, `queryKeys.categorySkills.details()` (category details include a linked-skill count) and `queryKeys.categorySkills.publicLists()` (public categories embed skills). Update also invalidates the skill detail, and delete removes it.

### Category projects (`/category-projects`)

Source: `apps/sadek-backend/src/category-projects`. Types in `@repo/types/category-projects`, service `categoryProjectsService` in `@repo/services/category-projects`, hooks in `@repo/hooks/category-projects`. All routes are guarded except `GET /category-projects/public`.

| Backend endpoint                         | Request                                                             | Response                                               |
| ---------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------ |
| `POST /category-projects`                | JSON `{ nameAr, nameEn, descriptionAr?, descriptionEn?, isActive }` | Saved category                                         |
| `GET /category-projects`                 | Query pagination plus `search`, `isActive`                          | Paginated categories with `user: { id }`               |
| `GET /category-projects/public` (Public) | Same query as `GET /category-projects`                              | Paginated categories of the default-view user          |
| `GET /category-projects/:id`             | –                                                                   | Category, without `user`                               |
| `PATCH /category-projects/:id`           | JSON partial of the create body                                     | `{ message: "Category project updated successfully" }` |
| `DELETE /category-projects/:id`          | –                                                                   | `{ message: "Category project deleted successfully" }` |

- Client: `categoryProjectsService.create/findAll/findAllPublic/findOne/update/remove`; hooks `useCreateCategoryProject`, `useCategoryProjects(query)`, `usePublicCategoryProjects(query)`, `useCategoryProject(id)` (`CategoryProjectDetails`, no `user`), `useUpdateCategoryProject` (`{ id, data }`), `useDeleteCategoryProject` (`id`). Update and delete also invalidate `queryKeys.projects.all`, because projects embed category names.
- Same fields and rules as category skills: `nameAr`/`nameEn` max 50, nullable descriptions, `isActive`, `createdAt`. Unlike category skills, the list is at the collection root, and `DELETE` does not check for linked projects.
- `GET`, `PATCH`, and `DELETE /:id` have no owner check.

### Projects (`/projects`)

Source: `apps/sadek-backend/src/projects`. Types in `@repo/types/projects` (`Project` for list items with `NamedRef` categories, `ProjectDetails` with full categories), service `projectsService` in `@repo/services/projects`, hooks in `@repo/hooks/projects`. All routes are guarded except `GET /projects/public`.

| Backend endpoint                | Request                                                                                                                   | Response                                              |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| `POST /projects`                | JSON `{ nameAr, nameEn, descriptionAr, descriptionEn, isActive, mainImageUrl?, liveUrl?, repoUrl?, categoryProjectsIds }` | Saved project                                         |
| `GET /projects`                 | Query pagination plus `search`, `isActive`, `categoryId`                                                                  | `PaginatedResponse<Project>`                          |
| `GET /projects/public` (Public) | Same query as `GET /projects`                                                                                             | `PaginatedResponse<Project>` of the default-view user |
| `GET /projects/:id`             | –                                                                                                                         | Project with full `categoryProjects`                  |
| `PATCH /projects/:id`           | JSON partial of the create body                                                                                           | `{ message: "project updated successfully" }`         |
| `DELETE /projects/:id`          | –                                                                                                                         | `{ message: "project removed successfully" }`         |

- Project fields: `id`, `nameAr`, `nameEn` (max 100), `descriptionAr`, `descriptionEn` (required), `isActive`, `mainImageUrl`, `liveUrl`, `repoUrl` (nullable, max 255), `createdAt`, `user: { id }`, `categoryProjects` (`[{ id, nameAr, nameEn }]` in the list).
- `categoryProjectsIds` must be a non-empty array of unique integers, all owned by the signed-in user, or the request returns 400.
- `GET /projects` returns only the signed-in user's projects. `search` matches `nameAr`/`nameEn`, `isActive` and `categoryId` filter, and `order` sorts by `createdAt`.
- Client: `projectsService.create/findAll/findAllPublic/findOne/update/remove`; hooks `useCreateProject`, `useProjects(query)`, `usePublicProjects(query)`, `useProject(id)`, `useUpdateProject` (`{ id, data }`), `useDeleteProject` (`id`).
- `GET`, `PATCH` (except the category ownership check), and `DELETE /:id` have no owner check.

### User info (`/user-info`)

Source: `apps/sadek-backend/src/user-info`. Types in `@repo/types/user-info` (`UserInfo` for list items with `user: { id }`, `UserInfoDetails` without it), service `userInfoService` in `@repo/services/user-info`, hooks in `@repo/hooks/user-info`. All routes are guarded except `GET /user-info/public`. One row per user (`userId` is unique).

| Backend endpoint                 | Request                                                                                                                                                                                                   | Response                                                                                                                                                                                       |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `POST /user-info`                | JSON `{ headTitle_en, headTitle_ar?, shortDescription_en, shortDescription_ar?, description_en, description_ar?, yearsOfExp, companies, projectNumbers, techMastering, gmail?, linkedin?, github?, cv? }` | Saved row with `user: { id }`; 409 if the user already has one                                                                                                                                 |
| `GET /user-info`                 | Query pagination plus `search`                                                                                                                                                                            | Paginated rows of **every** user, with `user: { id }`                                                                                                                                          |
| `GET /user-info/public` (Public) | No query                                                                                                                                                                                                  | The default-view user's row (`PublicUserInfoResponse`), with `user: { id, username, email, avatarUrl, coverPhotoUrl }` (`avatarUrl`/`coverPhotoUrl` nullable); 404 when no user is the default |
| `GET /user-info/me`              | –                                                                                                                                                                                                         | The signed-in user's row, without `user`; 404 if none                                                                                                                                          |
| `GET /user-info/:id`             | –                                                                                                                                                                                                         | Row, without `user`                                                                                                                                                                            |
| `PATCH /user-info/:id`           | JSON partial of the create body                                                                                                                                                                           | `{ message: "User info updated successfully" }`                                                                                                                                                |
| `DELETE /user-info/:id`          | –                                                                                                                                                                                                         | `{ message: "User info deleted successfully" }`                                                                                                                                                |

- Fields: `id`, `headTitle_en`/`headTitle_ar` (max 100), `shortDescription_en`/`shortDescription_ar` (max 255), `description_en`/`description_ar` (each `_en` required, each `_ar` nullable and cleared with `null`), `yearsOfExp`, `companies`, `projectNumbers`, `techMastering` (integers ≥ 0), `gmail` (email), `linkedin`, `github`, `cv` (http(s) URLs; all four nullable, max 255), `createdAt`.
- `search` (`FilterUserInfoDto`, max 20 characters, trimmed) matches `headTitle_en`, `headTitle_ar`, `shortDescription_en` or `shortDescription_ar` case-insensitively on `GET /user-info`.
- `GET /user-info/public` is a single `findOne` on `user.isDefaultView = true` (at most one such user), not a filtered list.
- Client: `userInfoService.create/findAll/findPublic/findMine/findOne/update/remove`; hooks `useCreateUserInfo`, `useUserInfos(query)`, `usePublicUserInfo()` (key `queryKeys.userInfo.public()`, under `lists()`), `useMyUserInfo()`, `useUserInfo(id)`, `useUpdateUserInfo` (`{ id, data }`), `useDeleteUserInfo` (`id`). Every mutation invalidates `queryKeys.userInfo.lists()` and `mine()`; update also refreshes `detail(id)`, delete removes it.
- `GET /user-info` is not owner-scoped, and `GET`, `PATCH`, `DELETE /:id` have no owner check. `:id` is parsed with `+id` (no `ParseIntPipe`), so a non-numeric id is not rejected with 400.

### User company (`/user-company`)

Source: `apps/sadek-backend/src/user-company`. Types in `@repo/types/user-company` (`UserCompany` for list items with `user: { id }`, `UserCompanyDetails` without it), service `userCompanyService` in `@repo/services/user-company`, hooks in `@repo/hooks/user-company`. All routes except `GET /user-company/public` are guarded and owner-scoped.

| Backend endpoint                    | Request                                                                                                           | Response                                           |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| `POST /user-company`                | JSON `{ name_en, name_ar?, description_en?, description_ar?, startWorkFrom, startWorkTo?, logo?, company_site? }` | Saved company with `user: { id }`                  |
| `GET /user-company`                 | Query pagination plus `search`                                                                                    | Paginated companies with `user: { id }`            |
| `GET /user-company/public` (Public) | Same query as `GET /user-company`                                                                                 | Paginated companies of the default-view user       |
| `GET /user-company/me`              | Query `page`, `limit`, `search`, `order` (sorts by `startWorkFrom`, default `DESC`)                               | Paginated `UserCompanyDetails`                     |
| `GET /user-company/:id`             | –                                                                                                                 | Company, without `user`                            |
| `PATCH /user-company/:id`           | JSON partial of the create body                                                                                   | `{ message: "User company updated successfully" }` |
| `DELETE /user-company/:id`          | –                                                                                                                 | `{ message: "User company deleted successfully" }` |

- Fields: `id`, `name_en` (required) / `name_ar` (nullable), both max 50; `description_en` / `description_ar` (nullable); `startWorkFrom` (required ISO date), `startWorkTo` (nullable; `null` means a current job), `logo`, `company_site` (nullable http(s) URLs, max 255), `createdAt`.
- `search` (max 20 characters, trimmed) matches the English or Arabic `name` or `description` (`name_en`, `name_ar`, `description_en`, `description_ar`) case-insensitively on `GET /user-company`, `GET /user-company/public`, and `GET /user-company/me`.
- `startWorkTo` before `startWorkFrom` returns 400 on create and update. Send `startWorkTo: null` in a `PATCH` to mark a job as current.
- A company of another user returns 404 from `GET`, `PATCH`, and `DELETE /:id`.
- Client: `userCompanyService.create/findAll/findAllPublic/findMine/findOne/update/remove`; hooks `useCreateUserCompany`, `useUserCompanies(query)`, `usePublicUserCompanies(query)`, `useMyUserCompanies(query)`, `useUserCompany(id)`, `useUpdateUserCompany` (`{ id, data }`), `useDeleteUserCompany` (`id`). Every mutation invalidates `queryKeys.userCompany.lists()` and `mines()`; update also refreshes `detail(id)`, delete removes it.

### What can do (`/what-can-do`)

Source: `apps/sadek-backend/src/what-can-do`. Types in `@repo/types/what-can-do` (`WhatCanDo` for list items with `user: { id }`, `WhatCanDoDetails` without it), service `whatCanDoService` in `@repo/services/what-can-do`, hooks in `@repo/hooks/what-can-do`. All routes except `GET /what-can-do/public` are guarded and owner-scoped.

| Backend endpoint                   | Request                                                                                                            | Response                                                 |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------- |
| `POST /what-can-do`                | JSON `{ title_en, title_ar?, shortDescription_en?, shortDescription_ar?, description_en?, description_ar?, rank }` | Saved item with `user: { id }`                           |
| `GET /what-can-do`                 | Query pagination plus `search`                                                                                     | Paginated items with `user: { id }`, by `createdAt`      |
| `GET /what-can-do/public` (Public) | Same query as `GET /what-can-do`                                                                                   | Paginated items of the default-view user, by `createdAt` |
| `GET /what-can-do/me`              | Query `page`, `limit`, `search`, `order` (sorts by `rank`, default `ASC`; ties by `id`)                            | Paginated `WhatCanDoDetails`                             |
| `GET /what-can-do/:id`             | –                                                                                                                  | Item, without `user`                                     |
| `PATCH /what-can-do/:id`           | JSON partial of the create body                                                                                    | `{ message: "What can do updated successfully" }`        |
| `DELETE /what-can-do/:id`          | –                                                                                                                  | `{ message: "What can do deleted successfully" }`        |

- Fields: `id`, `title_en` (required) / `title_ar` (nullable), both max 50; `shortDescription_en` / `shortDescription_ar` (nullable, max 100); `description_en` / `description_ar` (nullable); `rank` (required integer ≥ 0, set by the client, not unique), `createdAt`.
- `search` (max 20 characters, trimmed) matches the English or Arabic `title`, `shortDescription` or `description` (each `_en` and `_ar` column) case-insensitively on `GET /what-can-do`, `GET /what-can-do/public`, and `GET /what-can-do/me`.
- An item of another user returns 404 from `GET`, `PATCH`, and `DELETE /:id`.
- Client: `whatCanDoService.create/findAll/findAllPublic/findMine/findOne/update/remove`; hooks `useCreateWhatCanDo`, `useWhatCanDos(query)`, `usePublicWhatCanDos(query)`, `useMyWhatCanDos(query)`, `useWhatCanDo(id)`, `useUpdateWhatCanDo` (`{ id, data }`), `useDeleteWhatCanDo` (`id`). Every mutation invalidates `queryKeys.whatCanDo.lists()` and `mines()`; update also refreshes `detail(id)`, delete removes it.

## Guarded and public query wrappers

`@repo/hooks/api` wraps TanStack Query so endpoint hooks never handle tokens directly:

- `useGuardedQuery({ queryKey, queryFn: (auth) => ..., ...options })` and `useGuardedMutation({ mutationFn: (variables, auth) => ..., ...options })` read `session.accessToken` from `next-auth/react`'s `useSession()` and pass `{ accessToken }` (`AuthorizedRequest`) to the service. Guarded queries stay disabled until a token exists and respect any caller `enabled`. Guarded mutations reject with "Sign in before making an authenticated request." when signed out. The token is not part of query keys, so a token refresh does not refetch.
- `usePublicQuery({ queryKey, queryFn: () => ..., ... })` and `usePublicMutation({ mutationFn: (variables) => ..., ... })` have the same shape without a token. Use them for public endpoints.
- Use the guarded pair for every route marked Guarded above and the public pair for Public routes. Endpoint hooks (for example `@repo/hooks/category-skills`) own their query keys and cache invalidation.
- The wrappers require a NextAuth `SessionProvider` (from `@repo/provider/session-provider`) and `QueryProvider` above them. `api.ts` imports `@repo/libs/auth` as types only, for the `Session.accessToken` augmentation; this adds no server code to client bundles.

## External packages used

- `provider`: `@tanstack/react-query-devtools` supplies the query inspector inside `QueryProvider`, rendered only when `process.env.NODE_ENV === "development"` and initially closed. Keep it inside the shared provider and use the standard package entry point; do not enable its production entry point. `next-themes` powers `ThemeProvider` and `useTheme`.
- `libs`: `axios` provides the HTTP client; `@tanstack/react-query` provides QueryClient, the provider, and query/mutation hooks; `react` provides the React runtime.
- `hooks`: `react` is the client runtime; TanStack Query is consumed through `@repo/libs/query`, not a separately configured client. `next-auth` (`5.0.0-beta.32`, matching libs and the dashboard) supplies `useSession` for the guarded query wrappers in `@repo/hooks/api`.
- `types` has no runtime dependencies; services uses libs and shared API types.
- `ui`: `react` and `react-dom` provide rendering; `radix-ui` supplies accessible primitives; `vaul` supplies drawers; `lucide-react` supplies icons; `class-variance-authority` supplies variants; `clsx` and `tailwind-merge` implement class merging. `cn` is also declared in the package manifest. Tailwind CSS provides token-based styling through `global.css`.
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

- `next-auth` v5 (currently beta) is owned by `@repo/libs` and dashboard. `@repo/libs/auth` exports `createAuth(backendUrl, authService, cookiePrefix)` for server-only use; dashboard `auth.ts` exports handlers, auth, signIn, and signOut. Libs delegates login, refresh, and logout to `@repo/services/auth`, passing the server backend URL per request. Libs owns the Axios client at `@repo/libs/axios`. The dashboard passes `authService` into `createAuth`; libs uses a typed service interface and does not import services, keeping the package graph acyclic.
- Dashboard login now uses `signIn("credentials")` from `next-auth/react`, replacing its use of the in-memory login hook. Other shared query hooks retain their existing independent behavior.
- NextAuth uses `/api/session`, leaving `/api/auth` for the backend proxy. SessionProvider polls every 30 seconds and refetches on focus; session checks refresh expired access tokens. JWT `exp` claims control access and refresh expiry. Refresh preserves the original refresh token because the backend returns only access_token. Expired refresh tokens and failed refresh discard the entire auth JWT and both backend tokens on the next session check. The refresh token is never included in browser session JSON.
- Logout calls the backend with a valid access token where possible and clears the local session even on backend failure. Dashboard has server and client session guards and a sign-out button.
- Configure `AUTH_SECRET` (strong random secret), `AUTH_URL` (dashboard URL with `/api/session`), and `BACKEND_URL`. Set `AUTH_TRUST_HOST=true` only with a trusted deployment proxy. These server variables are passed through dashboard Turbo tasks.

## Shared session provider

- `packages/provider` (`@repo/provider`) owns the client `SessionProvider`, exported from `@repo/provider/session-provider`. It wraps `next-auth/react` with `/api/session`, 30-second polling, and refetch on window focus. Wrap app content in this provider to use client NextAuth sessions.
- The package uses `next-auth` and React, with Next.js supplied by its consuming app as a peer dependency. It uses the shared ESLint and TypeScript configurations and exports TypeScript source.

- `@repo/provider/query-provider` exports `QueryProvider`, using `getQueryClient` from `@repo/libs/query`. Provider owns the TanStack Query provider and development-only devtools dependencies; libs retains QueryClient configuration and hooks.
- `@repo/provider/theme-provider` exports `ThemeProvider` and `useTheme`. `ThemeProvider` wraps `next-themes` with `attribute="class"` and `disableTransitionOnChange` defaults, toggling the `.dark` class that switches the color tokens in `@repo/ui/global.css`; apps pass `defaultTheme` and `enableSystem`. Both `apps/web` and `apps/dashboard` use it.

- The dashboard passes `"sadek-dashboard"` as the `cookiePrefix` argument to `createAuth`; shared NextAuth cookie names use that prefix, including `sadek-dashboard.session-token`. Cookie options inherit NextAuth defaults, including HttpOnly, SameSite, path, secure handling, and temporary-cookie lifetimes. Changing names requires signing in again.
