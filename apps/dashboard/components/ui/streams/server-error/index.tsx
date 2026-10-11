"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@repo/ui/button";
import { ArrowLeft, RotateCw } from "@repo/ui/icons";
import { cn } from "@repo/ui/utils";
import { Link } from "../../../../i18n/navigation";

export type ServerErrorPageProps = {
  /** From error.tsx. Server errors only carry a generic message and a digest. */
  error: Error & { digest?: string };
  /** From error.tsx: re-fetches and re-renders the failed segment. */
  retry: () => void;
  /** Full-screen page (default), or a section inside an existing layout. */
  fullScreen?: boolean;
};

/** 500 UI for error.tsx boundaries, styled like the 404 page. */
export default function ServerErrorPage({
  error,
  retry,
  fullScreen = true,
}: ServerErrorPageProps) {
  const t = useTranslations();

  useEffect(() => {
    // The digest matches the server-side log entry for this error.
    console.error(error);
  }, [error]);

  return (
    <main
      className={cn(
        "flex items-center justify-center px-5 py-12 text-foreground",
        fullScreen ? "min-h-svh bg-background" : "min-h-[60vh]",
      )}
    >
      <div
        role="alert"
        className="flex w-full max-w-md flex-col items-center gap-6 text-center"
      >
        <p className="text-xs font-medium uppercase tracking-widest text-danger">
          {t("serverErrorEyebrow")}
        </p>
        <h1 className="text-7xl font-bold tracking-tight">500</h1>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">
            {t("serverErrorTitle")}
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            {t("serverErrorDescription")}
          </p>
          {error.digest && (
            <p className="text-xs text-muted-foreground">
              {t("serverErrorReference", { digest: error.digest })}
            </p>
          )}
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <Button type="button" className="h-11" onClick={() => retry()}>
            <RotateCw className="size-4" aria-hidden />
            {t("serverErrorRetry")}
          </Button>
          <Button asChild variant="ghost" className="h-11">
            <Link href="/">
              <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden />
              {t("notFoundBack")}
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
