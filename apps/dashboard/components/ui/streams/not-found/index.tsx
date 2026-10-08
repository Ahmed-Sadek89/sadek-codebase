import Link from "next/link";
import { Button } from "@repo/ui/button";
import { ArrowLeft } from "@repo/ui/icons";

export default function NotFoundPage() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-background px-5 py-12 text-foreground">
      <div className="flex w-full max-w-md flex-col items-center gap-6 text-center">
        <p className="text-xs font-medium uppercase tracking-widest text-primary">
          Error 404
        </p>
        <h1 className="text-7xl font-bold tracking-tight">404</h1>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">
            Page not found
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            The page you are looking for doesn&apos;t exist or has been moved.
          </p>
        </div>
        <Button asChild className="h-11">
          <Link href="/">
            <ArrowLeft className="size-4" aria-hidden />
            Back to home
          </Link>
        </Button>
      </div>
    </main>
  );
}
