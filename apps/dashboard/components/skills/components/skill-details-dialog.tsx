"use client";

import type { ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { Skill } from "@repo/types/skills";
import { Sparkles } from "@repo/ui/icons";
import { AppDialog } from "../../ui/dialog";
import { AvatarCell, DateCell, StatusBadgeCell } from "../../ui/cells";
import { localized } from "../../../utils/format";

export type SkillDetailsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The row to show; kept by the caller after closing for the close animation. */
  skill: Skill | null;
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

/** Read-only view of every field of a skill, opened from the row's View action. */
export function SkillDetailsDialog({
  open,
  onOpenChange,
  skill,
}: SkillDetailsDialogProps) {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <AppDialog
      open={open}
      onOpenChange={onOpenChange}
      className="sm:max-w-2xl"
      title={t("skillDetailsTitle")}
      description={t("skillDetailsDescription")}
      Icon={Sparkles}
    >
      {skill && (
        <div className="space-y-6">
          <div className="flex items-center gap-4 rounded-lg border border-border bg-muted/30 p-4">
            <AvatarCell
              size="lg"
              src={skill.avatar_url}
              name={localized(locale, skill.nameEn, skill.nameAr)}
            />
            <div className="min-w-0 flex-1 space-y-1">
              <p className="truncate text-base font-semibold">
                {localized(locale, skill.nameEn, skill.nameAr)}
              </p>
              <p className="text-xs text-muted-foreground tabular-nums">
                #{skill.id}
              </p>
            </div>
            <StatusBadgeCell
              value={skill.isActive ? t("statusActive") : t("statusInactive")}
              tone={skill.isActive ? "primary" : "danger"}
            />
          </div>

          <dl className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
            <DetailRow label={t("tableColSkillEn")}>
              <span lang="en" dir="ltr" className="font-medium">
                {skill.nameEn}
              </span>
            </DetailRow>
            <DetailRow label={t("tableColSkillAr")}>
              <span lang="ar" dir="rtl" className="font-medium">
                {skill.nameAr}
              </span>
            </DetailRow>
            <DetailRow
              label={t("skillFormAvatarUrlLabel")}
              className="sm:col-span-2"
            >
              {skill.avatar_url ? (
                <a
                  href={skill.avatar_url}
                  target="_blank"
                  rel="noreferrer noopener"
                  dir="ltr"
                  className="break-all text-primary underline-offset-4 hover:underline"
                >
                  {skill.avatar_url}
                </a>
              ) : (
                <span className="text-muted-foreground">—</span>
              )}
            </DetailRow>
            <DetailRow
              label={`${t("tableColCategories")} (${skill.categorySkills.length})`}
              className="sm:col-span-2"
            >
              {skill.categorySkills.length > 0 ? (
                <ul className="flex flex-wrap gap-1.5">
                  {skill.categorySkills.map((category) => (
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
              <DateCell value={skill.createdAt} />
            </DetailRow>
          </dl>
        </div>
      )}
    </AppDialog>
  );
}
