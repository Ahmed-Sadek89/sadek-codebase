# Turborepo starter

This Turborepo starter is maintained by the Turborepo core team.

## Using this example

Run the following command:

```sh
npx create-turbo@latest
```

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `dashboard`: a [Next.js](https://nextjs.org/) app
- `web`: another [Next.js](https://nextjs.org/) app
- `sadek-backend`: a NestJS API in `apps/sadek-backend` (port `4000` by default)
- `@repo/ui`: a stub React component library shared by both `web` and `dashboard` applications
- `@repo/eslint-config`: `eslint` configurations (includes `@next/eslint-plugin-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Backend development

Use Node.js 24 or newer and install dependencies from the repository root with
`pnpm install`. All apps share the root `pnpm-lock.yaml`.

Copy `apps/sadek-backend/.env.example` to `apps/sadek-backend/.env` and configure
the database and authentication settings before starting the API.

```sh
pnpm dev --filter=sadek-backend
pnpm build --filter=sadek-backend
pnpm check-types --filter=sadek-backend
pnpm --filter sadek-backend test --runInBand
```

Running `pnpm dev` from the root starts the backend alongside the frontend apps.

### Vercel deployments

Deploy each app as a separate Vercel project connected to this
repository. Each project has its own deployment and domain.

| Vercel project | Root Directory | Framework |
| --- | --- | --- |
| `web` | `apps/web` | Next.js |
| `dashboard` | `apps/dashboard` | Next.js |
| `sadek-backend` | `apps/sadek-backend` | NestJS |

Leave the Build Command and Output Directory set to their defaults. Vercel
uses the framework preset for each app. All projects share the
repository-level `pnpm-lock.yaml`. See
[backend deployment instructions](apps/sadek-backend/README.md#vercel) for Node.js
and environment settings.

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Build

To build all apps and packages, run the following command:

With [global `turbo`](https://turborepo.dev/dashboard/getting-started/installation#global-installation) installed (recommended):

```sh
cd my-turborepo
turbo build
```

Without global `turbo`, use your package manager:

```sh
cd my-turborepo
npx turbo build
pnpm exec turbo build
pnpm exec turbo build
```

You can build a specific package by using a [filter](https://turborepo.dev/dashboard/crafting-your-repository/running-tasks#using-filters):

With [global `turbo`](https://turborepo.dev/dashboard/getting-started/installation#global-installation) installed:

```sh
turbo build --filter=dashboard
```

Without global `turbo`:

```sh
npx turbo build --filter=dashboard
pnpm exec turbo build --filter=dashboard
pnpm exec turbo build --filter=dashboard
```

### Develop

To develop all apps and packages, run the following command:

With [global `turbo`](https://turborepo.dev/dashboard/getting-started/installation#global-installation) installed (recommended):

```sh
cd my-turborepo
turbo dev
```

Without global `turbo`, use your package manager:

```sh
cd my-turborepo
npx turbo dev
pnpm exec turbo dev
pnpm exec turbo dev
```

You can develop a specific package by using a [filter](https://turborepo.dev/dashboard/crafting-your-repository/running-tasks#using-filters):

With [global `turbo`](https://turborepo.dev/dashboard/getting-started/installation#global-installation) installed:

```sh
turbo dev --filter=web
```

Without global `turbo`:

```sh
npx turbo dev --filter=web
pnpm exec turbo dev --filter=web
pnpm exec turbo dev --filter=web
```

### Remote Caching

> [!TIP]
> Vercel Remote Cache is free for all plans. Get started today at [vercel.com](https://vercel.com/signup?utm_source=remote-cache-sdk&utm_campaign=free_remote_cache).

Turborepo can use a technique known as [Remote Caching](https://turborepo.dev/dashboard/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup?utm_source=turborepo-examples), then enter the following commands:

With [global `turbo`](https://turborepo.dev/dashboard/getting-started/installation#global-installation) installed (recommended):

```sh
cd my-turborepo
turbo login
```

Without global `turbo`, use your package manager:

```sh
cd my-turborepo
npx turbo login
pnpm exec turbo login
pnpm exec turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/dashboard/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

With [global `turbo`](https://turborepo.dev/dashboard/getting-started/installation#global-installation) installed:

```sh
turbo link
```

Without global `turbo`:

```sh
npx turbo link
pnpm exec turbo link
pnpm exec turbo link
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turborepo.dev/dashboard/crafting-your-repository/running-tasks)
- [Caching](https://turborepo.dev/dashboard/crafting-your-repository/caching)
- [Remote Caching](https://turborepo.dev/dashboard/core-concepts/remote-caching)
- [Filtering](https://turborepo.dev/dashboard/crafting-your-repository/running-tasks#using-filters)
- [Configuration Options](https://turborepo.dev/dashboard/reference/configuration)
- [CLI Usage](https://turborepo.dev/dashboard/reference/command-line-reference)
