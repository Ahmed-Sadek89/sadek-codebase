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
- Styling uses Tailwind CSS v4 with `@tailwindcss/postcss`.
- `packages/ui` (`@repo/ui`) provides shared shadcn components, icons, utilities, and theme styles.
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

- `/` contains login SEO metadata and renders `components/login/index.tsx`. Its `components/login-form.tsx` uses shared UI, `hooks/use-login-form.ts` manages the form, `schema/login.ts` holds fields and validation, and `utils/constants.ts` holds defaults and the destination route. React Hook Form validates through Zod before navigating to `/dashboard`; real authentication is not implemented yet.
- `/dashboard` currently displays placeholder text.
- Run `pnpm --filter dashboard lint` and `pnpm --filter dashboard check-types` after code changes.
- When changing shared UI, also run `pnpm --filter @repo/ui lint` and `pnpm --filter @repo/ui check-types`.
- Run `pnpm --filter dashboard dev` to start the dashboard on port 3001.
