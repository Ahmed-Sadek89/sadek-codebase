---
name: entity-client
description: Read a sadek-backend Nest module (controller, DTOs, service, entity) for one entity, such as projects or skills, then create or update its shared client code in packages/ (types in @repo/types, service in @repo/services, query keys in @repo/utils, TanStack hooks in @repo/hooks) and the packages/AGENTS.md docs. Use when the user asks to build, generate, sync or update frontend types, services or hooks for a backend entity, module or endpoint.
argument-hint: <entity, e.g. projects | category-skills | users>
---

# Entity client generator

Build the shared client layer for one backend entity: `$ARGUMENTS`.

The backend in `apps/sadek-backend/src` is the source of truth. Never invent routes, fields or query params. Never edit backend code in this skill; if the backend looks buggy, report it to the user instead.

Read `packages/AGENTS.md` first. It holds the package rules (dependency direction, no `staleTime`/`gcTime`, query keys only in `@repo/utils/query-keys`, guarded vs public wrappers) and the per-entity endpoint docs you will update at the end.

## 1. Resolve names

From the argument, work out:

| Name | Example (`projects`) | Example (`category-skills`) |
| --- | --- | --- |
| Backend folder | `apps/sadek-backend/src/projects` | `apps/sadek-backend/src/category_skills` (underscore) |
| Route prefix (from `@Controller(...)`) | `/projects` | `/category-skills` |
| Package file name (kebab-case) | `projects.ts` | `category-skills.ts` |
| Service export | `projectsService`, `projectsEndpoints` | `categorySkillsService`, `categorySkillsEndpoints` |
| Query-key object | `queryKeys.projects` | `queryKeys.categorySkills` |
| Entity type / hooks | `Project`, `useProjects`, `useProject`, `useCreateProject` ... | `CategorySkill`, `useCategorySkills` ... |

Find the folder with `ls apps/sadek-backend/src`; folder names do not always match the route. If the argument matches nothing, list the modules and ask which one was meant.

## 2. Read the backend module fully

Read every file, not just the controller:

- `*.controller.ts`: each route's HTTP verb, path, `@UseGuards(JwtAuthGuard)` (guarded) or none (public), `@Param` pipes (`ParseIntPipe` means numeric id), `@Query()` DTO, `@Body()` DTO, and what the handler returns. A handler that returns `{ message: '...' }` overrides whatever the service returns.
- `dto/*.ts`: field names, optionality (`?` / `@IsOptional`), types, and validation limits (`MaxLength`, `Min`, `ArrayNotEmpty`, `IsUrl`, regexes). Follow `extends` chains (`PartialType`, `PaginationQueryDto`, `OmitType`) and custom transformers such as `common/transformers/to-boolean.ts`.
- `entities/*.ts`: columns, `nullable`, `length`, `select: false` columns, and relations. Open related entities too, so you know the shape of embedded relations.
- `*.service.ts`: the exact response shape of each method. Look at `relations`, `select` (trimmed relations become `{ id }` or `NamedRef`), `paginate(...)` vs a plain array, which filters are actually applied (a DTO field that the service ignores must not appear in the client query type), owner scoping (`user: { id: userId }`), and thrown errors (`NotFoundException`, `BadRequestException`) and when they fire.
- Shared code it uses: `common/pagination.ts`, `common/dto/pagination-query.dto.ts`, and any other module service it calls (for example, ownership checks on related ids).

Before writing code, write out an endpoint inventory for yourself: method, path, access, path params, query type, body type, response type, notes. If a response shape is genuinely ambiguous after reading the service, ask the user rather than guessing.

## 3. Read the existing client code

Check whether these already exist for the entity, and read them plus one complete existing entity as the style reference (`projects` is the most complete):

- `packages/types/src/<name>.ts`, `packages/types/src/common.ts`, `packages/types/src/auth.ts` (`MessageResponse`, `AuthorizedRequest`)
- `packages/services/src/<name>.ts`, `packages/services/src/auth-headers.ts`
- `packages/utils/src/query-keys.ts`
- `packages/hooks/src/<name>.ts`, `packages/hooks/src/api.ts`
- each package's `package.json` `exports` and `src/index.ts`

If files exist, update them in place to match the backend. Keep exported names stable unless the backend change forces a rename, and grep `apps/` for usages of anything you rename or remove.

## 4. Types: `packages/types/src/<name>.ts`

Type-only, no runtime code. Import shared pieces from `./common` and `./auth` with `import type`.

Map backend code to TypeScript like this:

| Backend | Client type |
| --- | --- |
| `Date` column / `@CreateDateColumn` | `IsoDateString` |
| `nullable: true` column | `T \| null` in responses (even if the entity writes `field?: T`) |
| `select: false` column (passwords) | omit from response types |
| relation reduced by `select` to `{ id: true }` | `{ id: number }` |
| relation selected as `{ id, nameAr, nameEn }` | `NamedRef` |
| relation loaded in full | that entity's response type (reuse it from its own types file) |
| `paginate(...)` result | `PaginatedResponse<T>` |
| handler returns `{ message }` | `MessageResponse` |
| DTO `@IsOptional() field?: T` | `field?: T` in the request type |
| `PartialType(CreateDto)` | `Partial<CreateXRequest>` |
| `PaginationQueryDto` | `extends PaginationQuery` |
| Numeric/boolean query fields | `number` / `boolean` (the global pipe converts query strings) |

Conventions to follow (see `packages/types/src/projects.ts`):

- A private `XBase` interface when list and detail responses differ only in an embedded relation; export `X` (list item) and `XDetails` (detail).
- Export `CreateXRequest`, `CreateXResponse`, `XQuery`, `XResponse` (`PaginatedResponse<X>` or `X[]`), `UpdateXRequest`, `UpdateXResponse`, `DeleteXResponse`, plus any extra route types.
- `CreateXResponse` is what `repository.save()` returns: optional fields the client did not send are missing rather than `null`, so make them `?: T | null`.
- On updates, optional nullable fields that can be cleared accept `null`.
- Put validation limits in JSDoc on the field (`/** Max 100 characters. */`) and a one-line JSDoc naming the route on each exported type. Keep comments short like the existing files.

Then:

- Add `"./<name>": "./src/<name>.ts"` to `packages/types/package.json` `exports`.
- Add `export type * from "./<name>";` to `packages/types/src/index.ts`.

## 5. Service: `packages/services/src/<name>.ts`

Copy the structure of `packages/services/src/projects.ts`:

- `export const xEndpoints = { collection: "/route", byId: (id: number) => \`/route/${id}\`, ... } as const;` with one entry per distinct path (for example `privateList: "/category-skills/private"`).
- `export const xService = { create, findAll, findOne, update, remove, ... }`, one async method per backend route, each returning the typed `data` from `apiClient` (`@repo/libs/axios`).
- Guarded routes take `auth: AuthorizedRequest` as the last argument and send `{ headers: authHeaders(auth) }`. Public routes take no auth argument.
- Query params go in `{ params: query }`. Only send fields the DTO whitelists, because unknown fields return 400.
- If the list route accepts no usable query, `findAll(auth)` takes no query.

Then add the `exports` entry in `packages/services/package.json` and `export { xEndpoints, xService } from "./<name>";` in `packages/services/src/index.ts`.

## 6. Query keys: `packages/utils/src/query-keys.ts`

Add a nested object in the existing shape, with a root segment unique to the feature (the route name):

```ts
projects: {
  all: ["projects"] as const,
  lists: () => [...queryKeys.projects.all, "list"] as const,
  list: (query: ProjectsQuery) => [...queryKeys.projects.lists(), query] as const,
  details: () => [...queryKeys.projects.all, "detail"] as const,
  detail: (id: number) => [...queryKeys.projects.details(), id] as const,
},
```

Import the query type with `import type`. Drop `list(query)`'s parameter when the list takes no query. Add extra key functions only for extra GET routes.

## 7. Hooks: `packages/hooks/src/<name>.ts`

Copy the structure of `packages/hooks/src/projects.ts`:

- First line `"use client";`.
- Guarded routes use `useGuardedQuery` / `useGuardedMutation` from `./api`; public routes use `usePublicQuery` / `usePublicMutation`. Hooks never touch tokens.
- `useXs(query = {})`: list query with `queryKeys.x.list(query)` and `placeholderData: keepPreviousData` for paginated or filtered lists.
- `useX(id: number | undefined)`: `queryKey: queryKeys.x.detail(id ?? 0)`, `queryFn: (auth) => xService.findOne(id!, auth)`, `enabled: id !== undefined`.
- `useCreateX()`: invalidates `lists()`.
- `useUpdateX()`: variables `{ id, data }`; invalidates `lists()` and `detail(id)`.
- `useDeleteX()`: variables `id`; `removeQueries` on `detail(id)`, then invalidate `lists()`.
- Never set `staleTime` or `gcTime`.

Cross-entity invalidation: if other entities embed this one (for example, projects embed category-project names, and category-skill details count linked skills), invalidate those features' keys in the affected mutations too. Grep the backend services for relations that point at this entity, and check what existing hooks already invalidate for this entity.

Then add the `exports` entry in `packages/hooks/package.json` and a named export block in `packages/hooks/src/index.ts`.

If a package `package.json` changed, run `pnpm install` from the repo root so the workspace links stay current.

## 8. Update the docs

In `packages/AGENTS.md`:

- Package responsibilities table: add the new `@repo/types/<name>`, `@repo/services/<name>`, `@repo/hooks/<name>` and `queryKeys.<x>` import paths to the lists.
- Backend API endpoints: add or rewrite the entity's `### <Entity> (/route)` section with source folder, client names, access, an endpoint table (endpoint, request, response), field list with limits, ownership and validation notes, and the hooks' invalidation behavior. Fix anything in that section that no longer matches the backend.

## 9. Verify

Run from the repo root and fix every error before finishing:

```bash
pnpm --filter @repo/types --filter @repo/services --filter @repo/utils --filter @repo/hooks check-types
pnpm --filter @repo/types --filter @repo/services --filter @repo/utils --filter @repo/hooks lint
```

If you renamed or changed existing exports, also run `check-types` for the consuming apps (`pnpm --filter dashboard check-types`, `pnpm --filter web check-types`). The known failing `/api` fallback test in `packages/services/tests/auth.test.ts` is unrelated.

## 10. Report

Tell the user:

- the endpoint inventory you derived (a short table),
- the files you created or changed,
- the verification results, quoting any failures,
- backend oddities you noticed but did not change (an ignored query field, a missing owner check, inconsistent response shapes), so they can decide.
