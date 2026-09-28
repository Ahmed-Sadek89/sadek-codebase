import Link from "next/link";
import Image from "next/image";
import { Button } from "@repo/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";

export default function Home() {
  return (
    <main className="app-container grid min-h-svh place-items-center py-20">
      <div className="flex w-full max-w-md flex-col gap-8">
        <Image
          src="/turborepo-light.svg"
          alt="Turborepo logo"
          width={180}
          height={38}
          priority
        />
        <ol className="list-inside space-y-2 text-sm text-muted-foreground">
          <li>
            Get started by editing{" "}
            <code className="rounded bg-muted px-1 py-0.5 font-semibold text-foreground">
              apps/dashboard/app/page.tsx
            </code>
          </li>
          <li>Save and see your changes instantly.</li>
        </ol>
        <div className="flex gap-4 max-sm:flex-col">
          <Link
            className="flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground no-underline"
            href="https://vercel.com/new"
            target="_blank"
            rel="noopener noreferrer"
          >
            Deploy now
          </Link>
          <Link
            className="flex h-12 items-center justify-center rounded-full border border-border px-5 text-sm text-foreground no-underline"
            href="https://turborepo.dev/docs"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </Link>
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/80">
          Shared shadcn button
        </Button>
        <Card>
          <CardHeader>
            <CardTitle>Shared UI card</CardTitle>
            <CardDescription>Rendered by the dashboard app.</CardDescription>
          </CardHeader>
          <CardContent>
            This shadcn card is imported from the shared UI package.
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
