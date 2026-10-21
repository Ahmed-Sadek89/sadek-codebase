---
name: dashboard-table
description: Build a dashboard table page in apps/dashboard for one entity whose client code already exists in packages/ (@repo/types, @repo/services, @repo/hooks, queryKeys in @repo/utils). Given the entity name and the dashboard route, it writes the server prefetch in the route's page.tsx and the page module in apps/dashboard/components/<page> using the shared DynamicTable from components/ui/dynamic-table (columns hook, query builder, filters, translations). Use when the user asks to build, create or generate a table page, list page or dashboard page for an entity such as what-can-do, user-company or skills.
argument-hint: <entity> <route>, e.g. what-can-do user/what-can-i-do | user-company user/companies
---

# Dashboard table page generator

Build the table page for: `$ARGUMENTS`.

The first word is the **entity** (the file name in `packages/*/src`, e.g. `what-can-do`). The rest is the **route** under `/dashboard` (e.g. `user/what-can-i-do` → `apps/dashboard/app/[locale]/(dashboard)/dashboard/user/what-can-i-do/page.tsx`). If either is missing or matches nothing, list what exists (`ls packages/hooks/src`, `ls 'apps/dashboard/app/[locale]/(dashboard)/dashboard'`) and ask.

All work happens in `apps/dashboard`. The packages are the source of truth: never invent fields, query params or hooks, and never edit `packages/` or the backend here. If the entity's client code is missing or wrong, stop and tell the user to run the `entity-client` skill first.

Read `apps/dashboard/AGENTS.md` first. It defines the page/component structure, the prefetch pattern, `DynamicTable`, cells, filters, list-query helpers and i18n rules. Where it disagrees with the current reference pages (for example it mentions a `libs/prefetch.ts` that does not exist), follow the code in the reference pages and mention the mismatch in your report.

## 1. Read the packages for the entity

Read each file fully:

- `packages/types/src/<entity>.ts`: the row type used by the list (e.g. `WhatCanDo`), the list response (`PaginatedResponse<X>` or `X[]`), and the query type (`XQuery`): which fields it adds beyond `PaginationQuery` (`search`, `isActive`, `categoryId`, ...). Also read `packages/types/src/common.ts`.
- `packages/services/src/<entity>.ts`: the service export and every list method (`findAll`, `findMine`, `findPrivate`, ...), whether each takes `auth` (guarded) or not (public), and whether it takes a query.
- `packages/utils/src/query-keys.ts`: the entity's key object and the key function matching the list method (`list(query)`, `mine(query)`, ...).
- `packages/hooks/src/<entity>.ts`: the list hook matching that service method (e.g. `useWhatCanDos` ↔ `findAll` ↔ `queryKeys.whatCanDo.list`), plus which create/update/delete hooks exist.
- `packages/AGENTS.md`: the entity's endpoint section, for access rules and field limits.

Pick the list endpoint the page shows. If the entity has several (e.g. `GET /what-can-do` and `GET /what-can-do/me`), prefer the one documented for the dashboard owner's view; if it is still unclear, ask the user. The prefetch service method, query key and client hook must all be the same endpoint, or the hydrated cache is never used.

Write down for yourself: row type, response shape (paginated or array), query type and its extra filter fields, service method + auth, query-key function, hook name.

## 2. Read the reference implementation

Use `category-skills` as the template (simple paginated table with static filters) and `projects` / `skills` when the query has extra filters:

- `apps/dashboard/app/[locale]/(dashboard)/dashboard/skills/category/page.tsx`
- `apps/dashboard/app/[locale]/(dashboard)/dashboard/projects/page.tsx`
- `apps/dashboard/components/category-skills/index.tsx`, `hooks/use-columns.tsx`, `hooks/use-static-filter.ts`, `utils/constants.ts`
- `apps/dashboard/components/projects/utils/constants.ts`, `hooks/use-dynamic-filter.tsx`
- `apps/dashboard/components/ui/dynamic-table/types/types.ts` (props, `DynamicColumnDef`, `StaticFilter`, `DynamicFilter`) and `components/ui/cells/index.ts`
- `apps/dashboard/utils/list-query.ts`, `utils/constants.ts`, `utils/format.ts`
- The existing route `page.tsx` and `components/<page>/index.tsx` if they exist (they may be placeholders that only render a heading).

## 3. Resolve names

| Name | Example (`what-can-do`, route `user/what-can-i-do`) |
| --- | --- |
| Route file | `apps/dashboard/app/[locale]/(dashboard)/dashboard/user/what-can-i-do/page.tsx` |
| Component folder | `apps/dashboard/components/what-can-i-do` (reuse the folder the route already imports; otherwise the last route segment) |
| Root component | `WhatCanIDoPage` (default export of `index.tsx`) |
| Query builder | `getWhatCanDosQuery` in `utils/constants.ts` |
| Limit constant | `WHAT_CAN_DOS_LIMIT = 10` |
| Message prefix | `whatCanIDo` (`whatCanIDoTitle`, `whatCanIDoDescription`, `metaWhatCanIDoTitle`, ...) — reuse existing keys |

The `PageProps<"/[locale]/dashboard/...">` route literal must match the folder path exactly.

## 4. Query builder: `components/<page>/utils/constants.ts`

The server prefetch and the client hook must build an identical query object.

- Query has only list params (`search`, `page`, `limit`, `order`, `isActive`): take `ListQueryParams`, like `getCategorySkillsQuery(params)` → `{ limit: X_LIMIT, ...params }`. Callers wrap the reader with `readListQueryParams(...)`.
- Query has extra filters (`categoryId`, ...): take a `ParamReader`, like `getProjectsQuery(get)`, read each extra param with `readPositiveInt` etc. and add it only when set. Add new param-name constants to `apps/dashboard/utils/constants.ts`.
- `readListQueryParams` returns `order` and `isActive`. If the entity's query type has no `isActive` (or no `order`/`search`), omit those keys in the builder, because the backend rejects unknown params with 400. TypeScript catches this only if you annotate the return type with the entity's query type, so always do.
- The list endpoint takes no query: skip the builder and the `searchParams` prop entirely, and pass `showSearch={false}` and no `pagination`.

Give it a JSDoc like the reference saying which URL params it reads.

## 5. Route: `page.tsx` with the server prefetch

Copy the reference structure exactly (relative imports, no aliases):

```tsx
import { Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { dehydrate, getQueryClient, HydrationBoundary } from "@repo/libs/query";
import { xService } from "@repo/services/<entity>";
import { queryKeys } from "@repo/utils/query-keys";
import { auth } from "<rel>/libs/auth";
import XPage from "<rel>/components/<page>";
import { TableContentSkeleton } from "<rel>/components/ui/skeleton/table-content-skeleton";
import { getXQuery } from "<rel>/components/<page>/utils/constants";
import { readListQueryParams, recordParamReader } from "<rel>/utils/list-query";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  return { title: t("metaXTitle"), description: t("metaXDescription") };
}

export default async function Page({ searchParams }: PageProps<"/[locale]/dashboard/<route>">) {
  // ?search=&page=&limit=... (any combination). The client builds the same
  // query from useSearchParams, so the prefetch key matches.
  const query = getXQuery(readListQueryParams(recordParamReader(await searchParams)));
  const queryClient = getQueryClient();
  const accessToken = (await auth())?.accessToken;

  if (accessToken) {
    await queryClient.query({
      queryKey: queryKeys.x.list(query),
      queryFn: () => xService.findAll(query, { accessToken }),
    });
  }

  return (
    <Suspense fallback={<TableContentSkeleton />}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <XPage />
      </HydrationBoundary>
    </Suspense>
  );
}
```

- Public service methods: drop `auth()` / the `accessToken` guard and call without auth.
- If the endpoint can legitimately fail during prefetch (e.g. 404 until a row exists), add `.catch(() => undefined)` like `user/info/page.tsx`, so failures fall through to the client hook.
- Keep `page.tsx` a Server Component with one default `Page`. Count the `../` segments carefully from the route folder to `apps/dashboard`.

## 6. Module: `components/<page>/`

Follow the folder rules in `apps/dashboard/AGENTS.md` (`index.tsx`, `components/`, `hooks/`, `utils/`; `schema/` only if there is a form).

### `hooks/use-columns.tsx`

Default-export `useColumns(options)` returning `useMemo<DynamicColumnDef<Row>[]>`, copying `category-skills/hooks/use-columns.tsx`:

- One column per meaningful field of the row type, in a sensible order: `id` (muted), the main bilingual text, secondary fields, status, `createdAt` last. Skip owner refs like `user: { id }` and long body text unless it is the only text.
- Every column needs `sortable` (`true` when it has an `accessorKey`/`accessorFn`, `false` for actions/compound cells without a value).
- `accessorKey` must be a real key of the row type.
- Pick cells from `components/ui/cells`: `TextCell` for text/numbers (`tone="muted"`, `size="sm"` for secondary lines, `fallback` for `null`), `DateCell` for `IsoDateString`, `StatusBadgeCell` for booleans like `isActive`, `AvatarCell` for image URLs, `ChipsCell` for arrays of `NamedRef`.
- Bilingual pairs (`nameEn`/`nameAr`, `title_en`/`title_ar`): either one column per language with `meta: { cellProps: { lang, dir } }` like category-skills, or one column using `localized(locale, en, ar)` from `utils/format.ts`. Match what sibling pages do for similar data.
- Include the options `{ busy, onView, onEdit, onDelete, canView, canUpdate, canDelete }` and the conditional sticky `actions` column exactly as the reference, so a form or delete flow can be wired later without touching the columns.

### `hooks/use-static-filter.ts` (only when the query supports it)

Copy the category-skills hook, keeping only the chip groups the query type accepts (`order` → sort chips, `isActive` → status chips). Omit the file when neither exists.

### `hooks/use-dynamic-filter.tsx` (only for extra id filters)

Copy the projects hook when the query has a relation filter like `categoryId` and a matching filter component exists in `components/ui/filters`. Otherwise skip it and mention the missing filter in the report.

### `index.tsx`

`"use client"`, default export `XPage`, structured like `category-skills/index.tsx` minus the form/delete parts:

```tsx
const searchParams = useSearchParams();
const query = useMemo(
  () => getXQuery(readListQueryParams((name) => searchParams.get(name))),
  [searchParams],
);
const { data, isPending, isFetching, isError, refetch } = useXs(query);
const columns = useColumns();

return (
  <main className="space-y-6">
    <DynamicTable
      title={t("xTitle")}
      description={t("xDescription")}
      columns={columns}
      data={data?.data}          // `data` when the response is a plain array
      getRowId={(row) => String(row.id)}
      isLoading={isPending}
      isError={isError}
      onRetry={() => void refetch()}
      onReload={() => void refetch()}
      isRefreshing={isFetching}
      pagination={data}          // omit for a non-paginated array
      staticFilter={staticFilter}
    />
  </main>
);
```

The `useSearchParams` reader and the `page.tsx` reader must go through the same builder. Pass `showSearch={false}` when the query has no `search`.

Scope: build the table only. Do not build create/edit dialogs, schemas or delete confirmations unless the user asks; if they do, copy `category-skills/components/*-form.tsx`, `hooks/use-*-form.ts`, `hooks/use-delete-*.ts` and `schema/index.ts`, and wire `showCreate`, `makeCreateAction` and the column actions.

## 7. Translations

`apps/dashboard/messages/{en,ar,de,ru}.json` are flat camelCase keys, no dots, no nesting. Add every new key to all four files with real translations (Arabic, German, Russian), not English copies:

- `metaXTitle`, `metaXDescription` (reuse if they exist)
- `xTitle` (reuse), `xDescription`
- New column headers as `tableCol<Field>`; reuse existing `tableColId`, `tableColStatus`, `tableColCreatedAt`, `tableColActions` and others before adding new ones (`grep '"tableCol' apps/dashboard/messages/en.json`).

## 8. Docs and navigation

- Update `apps/dashboard/AGENTS.md` "Current routes and verification": replace the placeholder description of the route with what the page now does (endpoint, prefetch key, hook, columns, filters). Add newly used `@repo/hooks/<entity>` / `@repo/services/<entity>` imports to the packages section if not listed.
- Check the route is in `SIDEBAR_NAV_GROUPS` (`components/layouts/dashboard-layouts/components/sidebar-section/utils/constants.ts`); add it only if missing.

## 9. Verify

From the repo root, fix every error before finishing:

```bash
pnpm --filter dashboard check-types
pnpm --filter dashboard lint
```

If the dev server is running, load `/en/dashboard/<route>` and `/ar/dashboard/<route>` and confirm the table renders, and that `?search=`, `?page=` and `?limit=` change the rows.

## 10. Report

Tell the user:

- the endpoint, query key and hook the page uses, and why that endpoint if there were several,
- the files created or changed,
- the columns and filters shown, and any fields left out,
- the verification results, quoting failures,
- anything skipped (form, delete, a missing filter component) and doc/code mismatches noticed.
