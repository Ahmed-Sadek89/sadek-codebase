# Dashboard development instructions

All paths below are relative to the repository root. These rules apply to `apps/dashboard` alongside the repository's `AGENTS.md` instructions.

## Packages and imports

Keep this document current as part of every dependency change:

- When the dashboard starts importing a new workspace package from `packages/`, update this section with its package name, repository location, purpose, and supported import examples.
- When installing and using a new npm dependency in the dashboard, update this section with its package name, purpose, and how the dashboard uses it. Include development dependencies when they are used by dashboard tooling.
- When adding and using a dependency inside a shared package for dashboard functionality, document its purpose and the shared package that owns it.
- Update this `AGENTS.md` in the same change that introduces the dependency or its first use. Installing a package without using it does not require documenting it as used.
- When a documented dependency is removed or its usage changes, remove or revise its entry. Verify package names and import paths against the relevant `package.json` rather than guessing.

- The dashboard uses Next.js App Router, React, and TypeScript.
- `react-hook-form` manages login field registration, validation state, and submission through `useForm` and `handleSubmit` in `components/login/hooks/use-login-form.ts`.
- `zod` defines the login validation schema and inferred form value types in `components/login/schema/login.ts`. Email must be present and valid; password must be nonempty. Password complexity rules belong to future authentication requirements.
- `@hookform/resolvers` connects Zod to React Hook Form through `zodResolver`, imported from `@hookform/resolvers/zod`.
- `packages/types` (`@repo/types/auth`) provides backend auth contracts used to check the login schema's output type.
- `packages/provider` supplies `QueryProvider` from `@repo/provider/query-provider` in the root layout; `packages/libs` supplies `getApiErrorMessage` from `@repo/libs/axios` in the login form hook. Libs owns Axios and TanStack Query configuration. The provider package owns `@tanstack/react-query-devtools`; `QueryProvider` also renders `@tanstack/react-query-devtools` only in development, initially closed; the dashboard does not configure a separate inspector.
- Dashboard root layout imports `SessionProvider` from `@repo/provider/session-provider` (`packages/provider`), which owns the shared NextAuth client session wrapper and polling configuration.
- Dashboard authentication imports `createAuth` from `@repo/libs/auth` and client session APIs from `next-auth/react`; it no longer uses the shared in-memory auth hooks.
- The shared Axios client reads `NEXT_PUBLIC_BACKEND_URL` from the dashboard environment, falling back to `/api`. Set it in `.env.local` before starting/building; `.env.example` uses `/api` for the proxy. An absolute URL sends browser requests directly to the backend, which must allow the dashboard origin through CORS. Keep `NEXT_PUBLIC_BACKEND_URL` in the dashboard's Turbo build/dev environment declarations.
- `next.config.js` proxies `/api/auth/:path*` to the backend configured by the server-side `BACKEND_URL` variable, defaulting to `http://localhost:4000`. Copy `.env.example` to `.env.local` if changing the origin, then restart/rebuild the dashboard. Keep `BACKEND_URL` in the dashboard's Turbo task environment declarations.
- Styling uses Tailwind CSS v4 with `@tailwindcss/postcss`.
- `packages/ui` (`@repo/ui`) provides shared shadcn components, icons, utilities, and theme styles.
- `@repo/ui/select` (`packages/ui/src/select.tsx`, built on `radix-ui`'s `Select`) exports `Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, and `SelectItem`. The auth layout header (`components/layouts/auth-pages-layouts/components/header.tsx`) uses it through `components/ui/theme-switcher` and `components/ui/language-switcher`, each with options in its own `utils/constants.ts`. The language select switches the locale (see `next-intl` below).
- `@repo/ui/dropdown-menu` and `@repo/ui/avatar` (`packages/ui/src`, shadcn components built on `radix-ui`) are used by the dashboard layout header's user menu (`components/layouts/dashboard-layouts/components/header/components/user-menu.tsx`), which shows the session user's initial and offers Profile (`/dashboard/profile`) and Logout (`signOut`). The header also renders the shared theme and language selects and the sidebar toggle buttons (`header/components/sidebar-toggles.tsx`): a panel toggle on `lg` and up that calls `useSidebar().setOpen`, and a menu button below `lg` that calls `setOpenMobile(true)`.
- `@repo/ui/dialog` (`packages/ui/src/dialog.tsx`, shadcn on `radix-ui`'s `Dialog`) is used by `components/ui/confirm-action`, which exports `ConfirmAction({ question, onConfirm, open, onOpenChange })`: a controlled Confirm/Cancel dialog that awaits `onConfirm`, disables its buttons while pending, and closes on success. The header user menu opens it from Logout and calls `signOut` on confirm; the dialog is rendered outside `DropdownMenu` so it stays mounted after the menu closes.
- `tw-animate-css` is owned by `packages/ui` and imported in `packages/ui/src/global.css`. It supplies the `animate-in`/`animate-out`, `fade-*`, `zoom-*`, and `slide-*` utilities that the shadcn dialog, dropdown menu, and select use for open/close transitions. `ConfirmAction` adds a fade, zoom, and slide-up on open, the reverse on close, and disables the animation when the user prefers reduced motion.
- `@repo/ui/sidebar` (`packages/ui/src/sidebar.tsx`, shadcn sidebar) and `@repo/ui/collapsible` build the dashboard sidebar. The sidebar is adapted from shadcn in three ways. Below `lg` (`packages/ui/src/hooks/use-mobile.ts`, breakpoint 1024) it renders in the vaul `Drawer` from the left instead of a `Sheet`, and `sheet.tsx` was removed. Its desktop classes use `lg:` instead of `md:`. Its `--color-sidebar-*` tokens are mapped onto the existing palette in `global.css`. `components/layouts/dashboard-layouts/index.tsx` wraps the header and content in `SidebarProvider` so the header toggles can use `useSidebar`; page content renders in `SidebarInset`. `components/layouts/dashboard-layouts/components/sidebar-section` renders `Sidebar collapsible="icon"` placed below the `h-16` header. Each group in `utils/constants.ts` (`SIDEBAR_NAV_GROUPS`) renders as one `NavGroup`; items with `items` become collapsible nested links. Links close the drawer on small screens. The sticky `SidebarFooter` shows the current user and a logout button that opens `ConfirmAction`. `hooks/use-current-user.ts` provides the user's name, email, image, and initial to both the sidebar and the header user menu. The sidebar also brings `tooltip`, `separator`, and `skeleton` into `packages/ui`.
- `@repo/provider/theme-provider` (`packages/provider`, which owns `next-themes`) exports `ThemeProvider` and `useTheme`. The root layout wraps the app in `ThemeProvider` with `enableSystem` and `defaultTheme` `"system"`; the provider defaults to `attribute="class"`, toggling the `.dark` class that switches the color tokens in `packages/ui/src/global.css`; `<html>` has `suppressHydrationWarning` and no hardcoded theme class. `ThemeSelect` calls `useTheme().setTheme` and renders the default until mounted to avoid a hydration mismatch.
- `next-intl` localizes the dashboard in English, Arabic, German, and Russian with locale-prefixed URLs (`/en/dashboard`, `/ar/dashboard`, ...). All pages live under `app/[locale]`, whose `layout.tsx` is the root layout: it validates the locale, sets `<html lang dir>`, and wraps the app in `NextIntlClientProvider` and `DirectionProvider`. Do not add `app/layout.tsx`: the locale must stay a root param. `next.config.js` wraps the config with `createNextIntlPlugin("./i18n/request.ts")`. `i18n/config.ts` holds `LOCALES`, `DEFAULT_LOCALE` (`"en"`), the `NEXT_LOCALE` cookie name, and `getDirection` (`rtl` for Arabic). `i18n/request.ts` reads the locale from the URL via `next/root-params`. `i18n/routing.ts` defines the routing (`localePrefix: "always"`, no locale detection), and `i18n/navigation.ts` exports locale-aware `Link`, `usePathname`, `useRouter`, `redirect`, and `getPathname`: use them instead of `next/link`/`next/navigation` for internal links, with locale-free hrefs (`"/dashboard"`). `usePathname` returns the path without the locale, which the sidebar's `isActivePath` relies on. The language select calls `router.replace(pathname, { locale })`. Messages live in `messages/{en,ar,de,ru}.json` as one flat object of camelCase string keys: no nested objects and no dots in keys (next-intl reads dots as nesting). `en.json` is the source catalog: `global.d.ts` types `useTranslations`/`getTranslations` keys against it, and `i18n/types.ts` exports `MessageKey` for constants that store keys (`labelKey`, `titleKey`). Add every new key to all four files. Server components use `getTranslations()` from `next-intl/server`, client components use `useTranslations()`, and page metadata uses `generateMetadata`. The login Zod schema is built by `createLoginSchema(t)` so validation messages follow the locale. Unknown paths under a locale hit `app/[locale]/[...rest]/page.tsx`, which calls `notFound()` to render the localized `app/[locale]/not-found.tsx`.
- `@repo/ui/direction` (`packages/ui/src/direction.tsx`, wrapping `radix-ui`'s `Direction`) exports `DirectionProvider` and `useDirection`. Radix primitives read the reading direction from it. `@repo/ui/sidebar` uses it to default `side` to the reading-start edge (right in RTL) and to place collapsed tooltips. Shared and dashboard components use logical Tailwind utilities (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`) and flip directional icons with `rtl:` variants, so prefer those over `ml-`/`pl-`/`left-`/`text-left`.
- `packages/eslint-config` (`@repo/eslint-config`) provides shared ESLint configuration.
- `packages/typescript-config` (`@repo/typescript-config`) provides shared TypeScript configuration. The dashboard extends `@repo/typescript-config/nextjs.json`.
- pnpm manages workspace dependencies. Declare a shared package in `apps/dashboard/package.json` using its package name and `"workspace:*"` before importing it.

Import packages through their package names and exported paths, rather than relative imports into `packages/`:

```tsx
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Card, CardContent } from "@repo/ui/card";
import { cn } from "@repo/ui/utils";
import { ArrowRight } from "@repo/ui/icons";
```

`@repo/ui/<component>` resolves to `packages/ui/src/<component>.tsx`. Check a package's `package.json` exports before using an import path. Add reusable UI components to `packages/ui/src` and consume them from the dashboard.

`apps/dashboard/app/styles.css` imports `@repo/ui/global.css` and registers `../components`, `../ui`, and `../../../packages/ui/src` as Tailwind sources alongside the app directory. Use only color tokens defined in `packages/ui/src/global.css`, such as `bg-background`, `text-foreground`, `bg-card`, `text-muted-foreground`, `border-border`, `bg-primary`, and `text-danger` for errors. Do not introduce hardcoded colors, separate page palettes, or gradients.

## Route pages

Every `apps/dashboard/app/**/page.tsx`, including `apps/dashboard/app/page.tsx`, contains:

1. SEO metadata for that specific page, using Next.js `Metadata` or `generateMetadata` for dynamic metadata.
2. An import of the page's root component from `apps/dashboard/components`.
3. A default page export that renders that root component, passing route data when needed.

Keep page UI, form logic, and hooks in the components directory. Keep `page.tsx` as a Server Component so it can export metadata; add `"use client"` only to components that need browser APIs or React client hooks. Root layout metadata supplies shared defaults, but each page should describe its own content.

Example for `apps/dashboard/app/page.tsx`:

```tsx
import type { Metadata } from "next";
import LoginPage from "../components/login";

export const metadata: Metadata = {
  title: "Sign in | Sadek Dashboard",
  description: "Sign in to your portfolio dashboard.",
};

export default function Page() {
  return <LoginPage />;
}
```

Use relative imports for local components unless an alias is explicitly configured in the dashboard's TypeScript configuration.

## Page component structure

Use the plural directory name `apps/dashboard/components`. Each page has its own folder with this structure:

```text
apps/dashboard/components/
  login/
    index.tsx
    components/
      login-form.tsx
    hooks/
    utils/
    schema/
      login.ts
  dashboard/
    index.tsx
    components/
    hooks/
    utils/
```

- `index.tsx` exports the root page component imported by the route's `page.tsx`. It composes the page using child components from its own `components/` folder.
- `components/` contains page-specific UI components. These components consume shared inputs, buttons, cards, and other primitives from `@repo/ui`.
- `hooks/` contains all custom hooks needed by that page.
- `utils/` contains static functions and static variables, such as arrays of objects, constants, and data transformation helpers. Functions here must not call React hooks.
- `schema/` contains HTML form field information and validation definitions for that page. Create this folder only when the page has a form; omit it entirely for pages without forms. Validate submitted data on the server when implementing authentication or data mutations.

Keep page-specific code within its page folder. Move reusable UI primitives into `packages/ui/src` instead of duplicating them across page folders. Add files to each supporting folder as needed.

## Dashboard shared UI structure

Store components reusable across dashboard pages in `apps/dashboard/ui`. Structure each component as `ui/<parent>/<child>/index.tsx`, grouping components by purpose:

```text
apps/dashboard/ui/
  forms/
    base-inputs/
      index.tsx
```

- `ui/` contains dashboard-wide reusable compositions. Keep page-specific components in `components/<page>/components`, and keep primitives shared across apps in `packages/ui/src`.
- Each child folder's `index.tsx` exports its reusable component. Import from that folder using a relative path; no dashboard path alias is configured.
- Compose shared shadcn primitives from `@repo/ui` and use only colors from `packages/ui/src/global.css`.
- Keep page schemas, field definitions, validation rules, and submission hooks in their page folders. Shared UI receives labels, input props, and validation messages through props.
- `ui/forms/base-inputs` exports `BaseInput`, which combines a label, shared `Input`, and accessible inline error. It accepts native input props and refs, including React Hook Form's `register` result, plus `label`, optional `error`, and optional `containerClassName`. The input's `className` styles the input itself.
- The login form imports `BaseInput` from `../../../ui/forms/base-inputs`, spreads `form.register(field.name)`, and passes `errors[field.name]?.message` as `error`.

## Current routes and verification

- `/{locale}` (e.g. `/en`) contains login SEO metadata and renders `components/login/index.tsx`. Its `components/login-form.tsx` uses shared UI, `hooks/use-login-form.ts` manages the form, `schema/login.ts` holds fields and validation, and `utils/constants.ts` holds defaults and the destination route. React Hook Form validates through Zod, then NextAuth Credentials calls the backend on the server. Navigate to `/dashboard` only after success. Show server/network errors and allow retry after failure. The auth session persists in an encrypted HttpOnly NextAuth cookie.
- `/{locale}/dashboard` requires a valid NextAuth session and offers sign out.
- `app/[locale]/not-found.tsx` renders `components/ui/streams/not-found/index.tsx` for unmatched URLs (through the `[...rest]` catch-all) and `notFound()` calls. It renders inside the locale root layout (theme, fonts, providers, translations) and links to `/{locale}`, which the proxy forwards to `/{locale}/dashboard` for signed-in users. Because Next.js 16 serves `notFound()` thrown from a page through its error-recovery path, the server HTML is a minimal shell and the browser renders the localized 404 from the RSC payload; the status is still 404.
- Run `pnpm --filter dashboard lint` and `pnpm --filter dashboard check-types` after code changes.
- When changing shared UI, also run `pnpm --filter @repo/ui lint` and `pnpm --filter @repo/ui check-types`.
- Run `pnpm --filter dashboard dev` to start the dashboard on port 3001.

## Dashboard NextAuth authentication

- `next-auth` v5 (currently beta) is owned by `@repo/libs` and dashboard. `@repo/libs/auth` exports `createAuth(backendUrl, authService, cookiePrefix)` for server-only use; dashboard `auth.ts` exports handlers, auth, signIn, and signOut. Libs delegates login, refresh, and logout to `@repo/services/auth`, passing the server backend URL per request. Libs owns the Axios client at `@repo/libs/axios`. The dashboard passes `authService` into `createAuth`; libs uses a typed service interface and does not import services, keeping the package graph acyclic.
- Dashboard login now uses `signIn("credentials")` from `next-auth/react`, replacing its use of the in-memory login hook. Other shared query hooks retain their existing independent behavior.
- NextAuth uses `/api/session`, leaving `/api/auth` for the backend proxy. SessionProvider polls every 30 seconds and refetches on focus; session checks refresh expired access tokens. JWT `exp` claims control access and refresh expiry. Refresh preserves the original refresh token because the backend returns only access_token. Expired refresh tokens and failed refresh discard the entire auth JWT and both backend tokens on the next session check. The refresh token is never included in browser session JSON.
- Logout calls the backend with a valid access token where possible and clears the local session even on backend failure. Dashboard has server and client session guards and a sign-out button.
- Configure `AUTH_SECRET` (strong random secret), `AUTH_URL` (dashboard URL with `/api/session`), and `BACKEND_URL`. Set `AUTH_TRUST_HOST=true` only with a trusted deployment proxy. These server variables are passed through dashboard Turbo tasks.

- The dashboard passes `"sadek-dashboard"` as the `cookiePrefix` argument to `createAuth`; shared NextAuth cookie names use that prefix, including `sadek-dashboard.session-token`. Cookie options inherit NextAuth defaults, including HttpOnly, SameSite, path, secure handling, and temporary-cookie lifetimes. Changing names requires signing in again.

- Route redirects are implemented only in `proxy.ts`, using the NextAuth `auth` wrapper. The matcher covers every path except `api`, `_next`, `_vercel`, and files with an extension. A URL without a locale prefix redirects to the same path under the `NEXT_LOCALE` cookie's locale, or `/en`; `Accept-Language` is ignored. The proxy refreshes that cookie to the URL's locale on every page request. Within a locale, dashboard routes without an access token redirect to `/{locale}`; authenticated requests to `/{locale}` redirect to `/{locale}/dashboard`. Unprefixed redirects such as logout (`/`) and the post-login `/dashboard` land in the user's current language through the cookie.

- Successful login passes `/dashboard` as NextAuth `redirectTo`, then uses a full navigation to `/dashboard` so the proxy evaluates the freshly issued session cookie. `libs/auth.ts` exports both `handlers` and `auth` from the same configuration.

- The client session exposes only the access token and expiries; the refresh token stays in the encrypted session cookie. Access tokens refresh 30 seconds before expiry. Server-side auth reads `BACKEND_URL`, falling back to `NEXT_PUBLIC_BACKEND_URL`.
