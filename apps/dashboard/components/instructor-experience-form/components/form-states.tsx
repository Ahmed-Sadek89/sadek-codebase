"use client";

import { useTranslations } from "next-intl";
import { Button } from "@repo/ui/button";
import { ArrowLeft, CircleAlert, GraduationCap, RotateCw } from "@repo/ui/icons";
import { cn } from "@repo/ui/utils";
import { Link } from "../../../i18n/navigation";
import { INSTRUCTOR_EXPERIENCES_HREF } from "../../instructor-experience/utils/constants";

function BackToList() {
  const t = useTranslations();
  return (
    <Button asChild variant="outline">
      <Link href={INSTRUCTOR_EXPERIENCES_HREF}>
        <ArrowLeft className="size-4 rtl:-scale-x-100" aria-hidden />
        {t("instructorExperienceFormBack")}
      </Link>
    </Button>
  );
}

/** GET /instructor-experience/:id answered 404: no such row, or another user's. */
export function InstructorExperienceNotFound() {
  const t = useTranslations();
  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed bg-card px-6 py-12 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <GraduationCap className="size-7" aria-hidden />
      </span>
      <div className="max-w-md space-y-1">
        <h1 className="text-lg font-semibold">
          {t("instructorExperienceNotFoundTitle")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t("instructorExperienceNotFoundDescription")}
        </p>
      </div>
      <BackToList />
    </div>
  );
}

/** Any other failure while loading the row. */
export function InstructorExperienceLoadError({
  onRetry,
  isRetrying = false,
}: {
  onRetry: () => void;
  isRetrying?: boolean;
}) {
  const t = useTranslations();
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-3 rounded-xl border border-danger/30 bg-danger/5 px-6 py-10 text-center"
    >
      <CircleAlert className="size-8 text-danger" aria-hidden />
      <p className="text-danger">{t("instructorExperienceLoadError")}</p>
      <div className="flex flex-wrap justify-center gap-2">
        <BackToList />
        <Button type="button" variant="outline" onClick={onRetry} disabled={isRetrying}>
          <RotateCw className={cn("size-4", isRetrying && "animate-spin")} aria-hidden />
          {t("projectLoadRetry")}
        </Button>
      </div>
    </div>
  );
}
