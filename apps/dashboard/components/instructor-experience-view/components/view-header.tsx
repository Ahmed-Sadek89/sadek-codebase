"use client";

import { useTranslations } from "next-intl";
import type { InstructorExperience } from "@repo/types/instructor-experience";
import { Button } from "@repo/ui/button";
import { ArrowLeft, CircleCheck, CircleOff, Pencil, Trash2 } from "@repo/ui/icons";
import { StatusBadgeCell } from "../../ui/cells";
import { Link } from "../../../i18n/navigation";
import { INSTRUCTOR_EXPERIENCES_HREF } from "../../instructor-experience/utils/constants";

type ViewHeaderProps = {
  instructorExperience: InstructorExperience;
  busy: boolean;
  onToggleActive: () => void;
  onDelete: () => void;
};

/** Sticky bar under the dashboard header: back, name and status, then Make live / Take offline, Edit and Delete. */
export function ViewHeader({
  instructorExperience,
  busy,
  onToggleActive,
  onDelete,
}: ViewHeaderProps) {
  const t = useTranslations();
  const { id, name, isActive } = instructorExperience;

  return (
    <div className="sticky top-16 z-20 -mx-4 border-b border-border bg-background/90 px-4 py-3 backdrop-blur lg:-mx-6 lg:px-6">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <Button
            asChild
            variant="outline"
            size="icon"
            className="shrink-0"
            aria-label={t("instructorExperienceFormBack")}
            title={t("instructorExperienceFormBack")}
          >
            <Link href={INSTRUCTOR_EXPERIENCES_HREF}>
              <ArrowLeft className="size-4 rtl:-scale-x-100" aria-hidden />
            </Link>
          </Button>
          <div className="min-w-0">
            <Link
              href={INSTRUCTOR_EXPERIENCES_HREF}
              className="text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              {t("instructorExperienceFormBack")}
            </Link>
            <div className="flex min-w-0 items-center gap-2">
              <h1 className="truncate text-lg font-semibold sm:text-xl" dir="auto">
                {name}
              </h1>
              <StatusBadgeCell
                value={isActive ? t("statusActive") : t("statusInactive")}
                tone={isActive ? "primary" : "danger"}
              />
            </div>
          </div>
        </div>
        <div className="flex w-full flex-wrap gap-2 sm:w-auto">
          <Button
            type="button"
            variant="outline"
            className="flex-1 sm:flex-none"
            disabled={busy}
            onClick={onToggleActive}
          >
            {isActive ? (
              <CircleOff className="size-4 text-danger" aria-hidden />
            ) : (
              <CircleCheck className="size-4 text-success" aria-hidden />
            )}
            {isActive ? t("tableActionDeactivate") : t("tableActionActivate")}
          </Button>
          <Button asChild className="flex-1 sm:flex-none">
            <Link href={`${INSTRUCTOR_EXPERIENCES_HREF}/form/${id}`}>
              <Pencil className="size-4" aria-hidden />
              {t("tableActionEdit")}
            </Link>
          </Button>
          <Button
            type="button"
            variant="outline-danger"
            className="flex-1 sm:flex-none"
            disabled={busy}
            onClick={onDelete}
          >
            <Trash2 className="size-4" aria-hidden />
            {t("tableActionDelete")}
          </Button>
        </div>
      </div>
    </div>
  );
}
