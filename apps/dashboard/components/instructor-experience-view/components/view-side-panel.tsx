"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import type { InstructorExperience } from "@repo/types/instructor-experience";
import { BookOpen, ExternalLink, Globe } from "@repo/ui/icons";
import { DateCell, StatusBadgeCell } from "../../ui/cells";
import { FormCard } from "../../project-form/components/form-card";

function DetailRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="min-w-0 text-end font-medium">{children}</dd>
    </div>
  );
}

function LinkCard({ url, label, icon }: { url: string; label: string; icon: ReactNode }) {
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

/** Status, rank, id and date, then the skills taught and the course / platform links. */
export function ViewSidePanel({
  instructorExperience,
}: {
  instructorExperience: InstructorExperience;
}) {
  const t = useTranslations();
  const { skills } = instructorExperience;

  return (
    // Sticks below the dashboard header and the action bar.
    <aside className="min-w-0 space-y-6 self-start lg:sticky lg:top-40">
      <FormCard title={t("projectViewDetails")}>
        <dl className="space-y-3">
          <DetailRow label={t("tableColStatus")}>
            <StatusBadgeCell
              value={
                instructorExperience.isActive ? t("statusActive") : t("statusInactive")
              }
              tone={instructorExperience.isActive ? "primary" : "danger"}
            />
          </DetailRow>
          <DetailRow label={t("tableColRank")}>
            <span className="tabular-nums">{instructorExperience.rank}</span>
          </DetailRow>
          <DetailRow label={t("tableColId")}>
            <span className="tabular-nums">{instructorExperience.id}</span>
          </DetailRow>
          <DetailRow label={t("tableColCreatedAt")}>
            <DateCell value={instructorExperience.createdAt} />
          </DetailRow>
        </dl>
      </FormCard>

      <FormCard title={`${t("instructorExperienceFormSectionSkills")} (${skills.length})`}>
        {skills.length > 0 ? (
          <ul className="flex flex-wrap gap-1.5">
            {skills.map((skill) => (
              <li
                key={skill.id}
                dir="auto"
                className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
              >
                {skill.name}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">—</p>
        )}
      </FormCard>

      <FormCard title={t("projectFormSectionLinks")} contentClassName="space-y-2">
        <LinkCard
          url={instructorExperience.courseLink}
          label={t("instructorExperienceViewCourseLink")}
          icon={<BookOpen className="size-4 shrink-0 text-muted-foreground" aria-hidden />}
        />
        <LinkCard
          url={instructorExperience.coursePlatformUrl}
          label={instructorExperience.coursePlatformName}
          icon={<Globe className="size-4 shrink-0 text-muted-foreground" aria-hidden />}
        />
      </FormCard>
    </aside>
  );
}
