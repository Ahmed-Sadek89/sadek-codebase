# Shared shadcn components

Shared shadcn components live in `packages/ui/src`. Keeping them there lets
both Next.js apps use the same implementation and design tokens.

## Installed card command

The Card component was installed with this command from the repository root:

```sh
pnpm exec shadcn add card -c packages/ui --yes --overwrite
```

`-c packages/ui` tells shadcn to generate the component in the shared package.
The generated file is `packages/ui/src/card.tsx`, so both apps use exactly the
same official shadcn component.

## Add a component

Use the same command for another component, replacing `card` with its name:

```sh
pnpm exec shadcn add <component> -c packages/ui --yes
```

Each app already scans `packages/ui/src` for Tailwind classes, so no app
Tailwind configuration changes are needed.

For example, the shared card is defined in `packages/ui/src/card.tsx` and is
available to both apps.

## Import a component

Import from the `@repo/ui` workspace package, using the component filename:

```tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
```

Then compose it in an app:

```tsx
<Card>
  <CardHeader>
    <CardTitle>Project status</CardTitle>
    <CardDescription>Shared across web and dashboard.</CardDescription>
  </CardHeader>
  <CardContent>Ready to ship.</CardContent>
</Card>
```

Use the same pattern for every shared shadcn component. Keep application
routes in `apps/web` or `apps/dashboard`, and keep reusable UI in `packages/ui`.
