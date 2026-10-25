"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import type { Project } from "@repo/types/projects";
import { FolderKanban } from "@repo/ui/icons";
import { RichTextContent } from "@repo/ui/rich-text";
import { AppDialog } from "../../ui/dialog";
import { DateCell, StatusBadgeCell } from "../../ui/cells";
import { isMediaUrl } from "../../../libs/media";
import { localized } from "../../../utils/format";

export type ProjectDetailsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The row to show; kept by the caller after closing for the close animation. */
  project: Project | null;
};

function DetailRow({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1.5 text-sm text-foreground">{children}</dd>
    </div>
  );
}

function ExternalUrl({ url }: { url: string | null }) {
  if (!url) return <span className="text-muted-foreground">—</span>;
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer noopener"
      dir="ltr"
      className="break-all text-primary underline-offset-4 hover:underline"
    >
      {url}
    </a>
  );
}

/** Read-only view of every field of a project, opened from the row's View action. */
export function ProjectDetailsDialog({
  open,
  onOpenChange,
  project,
}: ProjectDetailsDialogProps) {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <AppDialog
      open={open}
      onOpenChange={onOpenChange}
      className="sm:max-w-5xl max-h-[85dvh]! overflow-y-auto!"
      title={t("projectDetailsTitle")}
      description={t("projectDetailsDescription")}
      Icon={FolderKanban}
    >
      {project && (
        <div className="space-y-6">
          <div className="overflow-hidden rounded-lg border border-border bg-muted/30">
            {/* next/image throws for hosts outside the allowed patterns. */}
            {isMediaUrl(project.mainImageUrl) ? (
              <Image
                src={project.mainImageUrl}
                alt={localized(locale, project.nameEn, project.nameAr)}
                width={672}
                height={378}
                className="aspect-video w-full object-cover"
              />
            ) : (
              <div className="flex aspect-video w-full items-center justify-center bg-surface">
                <FolderKanban
                  className="size-10 text-muted-foreground"
                  aria-hidden
                />
              </div>
            )}
            <div className="flex items-center gap-4 p-4">
              <div className="min-w-0 flex-1 space-y-1">
                <p className="truncate text-base font-semibold">
                  {localized(locale, project.nameEn, project.nameAr)}
                </p>
                <p className="text-xs text-muted-foreground tabular-nums">
                  #{project.id}
                </p>
              </div>
              <StatusBadgeCell
                value={
                  project.isActive ? t("statusActive") : t("statusInactive")
                }
                tone={project.isActive ? "primary" : "danger"}
              />
            </div>
          </div>

          <dl className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
            <DetailRow label={t("tableColProjectEn")}>
              <span lang="en" dir="ltr" className="font-medium">
                {project.nameEn}
              </span>
            </DetailRow>
            <DetailRow label={t("tableColProjectAr")}>
              <span lang="ar" dir="rtl" className="font-medium">
                {project.nameAr}
              </span>
            </DetailRow>
            <DetailRow label={t("projectFormShortDescriptionEnLabel")}>
              <p lang="en" dir="ltr" className="whitespace-pre-line">
                {project.shortDescriptionEn || "—"}
              </p>
            </DetailRow>
            <DetailRow label={t("projectFormShortDescriptionArLabel")}>
              <p lang="ar" dir="rtl" className="whitespace-pre-line">
                {project.shortDescriptionAr || "—"}
              </p>
            </DetailRow>
            <DetailRow label={t("projectFormDescriptionEnLabel")} className="sm:col-span-2">
              <RichTextContent lang="en" dir="ltr" html={project.descriptionEn} />
            </DetailRow>
            <DetailRow label={t("projectFormDescriptionArLabel")} className="sm:col-span-2">
              <RichTextContent lang="ar" dir="rtl" html={project.descriptionAr} />
            </DetailRow>
            <DetailRow label={t("projectLiveLink")} className="sm:col-span-2">
              <ExternalUrl url={project.liveUrl} />
            </DetailRow>
            <DetailRow label={t("projectRepoLink")} className="sm:col-span-2">
              <ExternalUrl url={project.repoUrl} />
            </DetailRow>
            <DetailRow
              label={`${t("tableColCategories")} (${project.categoryProjects.length})`}
              className="sm:col-span-2"
            >
              {project.categoryProjects.length > 0 ? (
                <ul className="flex flex-wrap gap-1.5">
                  {project.categoryProjects.map((category) => (
                    <li
                      key={category.id}
                      dir="auto"
                      className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                    >
                      {localized(locale, category.nameEn, category.nameAr)}
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="text-muted-foreground">—</span>
              )}
            </DetailRow>
            <DetailRow label={t("tableColCreatedAt")}>
              <DateCell value={project.createdAt} />
            </DetailRow>
          </dl>
        </div>
      )}
    </AppDialog>
  );
}
