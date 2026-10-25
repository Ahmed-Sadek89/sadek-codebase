"use client";

import type { ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { ProjectDetails } from "@repo/types/projects";
import { Code2, ExternalLink, Globe } from "@repo/ui/icons";
import { DateCell, StatusBadgeCell } from "../../ui/cells";
import { localized } from "../../../utils/format";
import { FormCard } from "../../project-form/components/form-card";

function DetailRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="min-w-0 text-end font-medium">{children}</dd>
    </div>
  );
}

function ProjectLink({
  url,
  label,
  icon,
}: {
  url: string | null;
  label: string;
  icon: ReactNode;
}) {
  if (!url) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-dashed px-3 py-2.5 text-sm text-muted-foreground">
        {icon}
        <span>{label}</span>
        <span className="ms-auto">—</span>
      </div>
    );
  }
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-3 rounded-lg border px-3 py-2.5 text-sm transition-colors hover:border-primary/40 hover:bg-primary/5"
    >
      {icon}
      <span className="min-w-0 flex-1">
        <span className="block font-medium">{label}</span>
        <span className="block truncate text-xs text-muted-foreground" dir="ltr">
          {url}
        </span>
      </span>
      <ExternalLink
        className="size-4 shrink-0 text-muted-foreground group-hover:text-primary"
        aria-hidden
      />
    </a>
  );
}

/** Status, id and date, then categories and the live / source links. */
export function ProjectSidePanel({ project }: { project: ProjectDetails }) {
  const t = useTranslations();
  const locale = useLocale();

  return (
    // Sticks below the dashboard header and the action bar.
    <aside className="min-w-0 space-y-6 self-start lg:sticky lg:top-40">
      <FormCard title={t("projectViewDetails")}>
        <dl className="space-y-3">
          <DetailRow label={t("tableColStatus")}>
            <StatusBadgeCell
              value={project.isActive ? t("statusActive") : t("statusInactive")}
              tone={project.isActive ? "primary" : "danger"}
            />
          </DetailRow>
          <DetailRow label={t("tableColRank")}>
            <span className="tabular-nums">{project.rank}</span>
          </DetailRow>
          <DetailRow label={t("tableColId")}>
            <span className="tabular-nums">{project.id}</span>
          </DetailRow>
          <DetailRow label={t("tableColCreatedAt")}>
            <DateCell value={project.createdAt} />
          </DetailRow>
        </dl>
      </FormCard>

      <FormCard
        title={`${t("projectFormSectionCategories")} (${project.categoryProjects.length})`}
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
          <p className="text-sm text-muted-foreground">—</p>
        )}
      </FormCard>

      <FormCard title={t("projectFormSectionLinks")} contentClassName="space-y-2">
        <ProjectLink
          url={project.liveUrl}
          label={t("projectLiveLink")}
          icon={<Globe className="size-4 shrink-0 text-muted-foreground" aria-hidden />}
        />
        <ProjectLink
          url={project.repoUrl}
          label={t("projectRepoLink")}
          icon={<Code2 className="size-4 shrink-0 text-muted-foreground" aria-hidden />}
        />
      </FormCard>
    </aside>
  );
}
