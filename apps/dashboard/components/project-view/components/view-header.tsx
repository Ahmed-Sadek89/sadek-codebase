"use client";

import { useLocale, useTranslations } from "next-intl";
import type { ProjectDetails } from "@repo/types/projects";
import { Button } from "@repo/ui/button";
import { ArrowLeft, CircleCheck, CircleOff, Pencil, Trash2 } from "@repo/ui/icons";
import { StatusBadgeCell } from "../../ui/cells";
import { Link } from "../../../i18n/navigation";
import { localized } from "../../../utils/format";

type ViewHeaderProps = {
  project: ProjectDetails;
  busy: boolean;
  onToggleActive: () => void;
  onDelete: () => void;
};

/** Sticky bar under the dashboard header: back, name and status, then Make live / Take offline, Edit and Delete. */
export function ViewHeader({ project, busy, onToggleActive, onDelete }: ViewHeaderProps) {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <div className="sticky top-16 z-20 -mx-4 border-b border-border bg-background/90 px-4 py-3 backdrop-blur lg:-mx-6 lg:px-6">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <Button
            asChild
            variant="outline"
            size="icon"
            className="shrink-0"
            aria-label={t("projectFormBack")}
            title={t("projectFormBack")}
          >
            <Link href="/dashboard/projects">
              <ArrowLeft className="size-4 rtl:-scale-x-100" aria-hidden />
            </Link>
          </Button>
          <div className="min-w-0">
            <Link
              href="/dashboard/projects"
              className="text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              {t("projectFormBack")}
            </Link>
            <div className="flex min-w-0 items-center gap-2">
              <h1 className="truncate text-lg font-semibold sm:text-xl" dir="auto">
                {localized(locale, project.nameEn, project.nameAr)}
              </h1>
              <StatusBadgeCell
                value={project.isActive ? t("statusActive") : t("statusInactive")}
                tone={project.isActive ? "primary" : "danger"}
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
            {project.isActive ? (
              <CircleOff className="size-4 text-danger" aria-hidden />
            ) : (
              <CircleCheck className="size-4 text-success" aria-hidden />
            )}
            {project.isActive ? t("tableActionDeactivate") : t("tableActionActivate")}
          </Button>
          <Button asChild className="flex-1 sm:flex-none">
            <Link href={`/dashboard/projects/form/${project.id}`}>
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
