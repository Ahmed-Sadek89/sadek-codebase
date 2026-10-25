"use client";

import type { ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { CategoryProject } from "@repo/types/category-projects";
import { FolderOpen } from "@repo/ui/icons";
import { AppDialog } from "../../ui/dialog";
import { DateCell, StatusBadgeCell } from "../../ui/cells";
import { localized } from "../../../utils/format";

export type CategoryProjectDetailsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The row to show; kept by the caller after closing for the close animation. */
  category: CategoryProject | null;
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

const EMPTY = <span className="text-muted-foreground">—</span>;

/** Full text in its language's direction, or an em dash when empty. */
function DetailText({
  value,
  lang,
}: {
  value: string | null;
  lang: "en" | "ar";
}) {
  if (!value) return EMPTY;
  return (
    <p
      lang={lang}
      dir={lang === "ar" ? "rtl" : "ltr"}
      className="whitespace-pre-wrap break-words"
    >
      {value}
    </p>
  );
}

/** Read-only view of every field of a category, opened from the row's View action. */
export function CategoryProjectDetailsDialog({
  open,
  onOpenChange,
  category,
}: CategoryProjectDetailsDialogProps) {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <AppDialog
      open={open}
      onOpenChange={onOpenChange}
      className="sm:max-w-2xl max-h-[85dvh]! overflow-y-auto!"
      title={t("categoryProjectDetailsTitle")}
      description={t("categoryProjectDetailsDescription")}
      Icon={FolderOpen}
    >
      {category && (
        <div className="space-y-6">
          <div className="flex items-center gap-4 rounded-lg border border-border bg-muted/30 p-4">
            <div className="min-w-0 flex-1 space-y-1">
              <p className="truncate text-base font-semibold" dir="auto">
                {localized(locale, category.nameEn, category.nameAr)}
              </p>
              <p className="text-xs text-muted-foreground tabular-nums">
                #{category.id}
              </p>
            </div>
            <StatusBadgeCell
              value={category.isActive ? t("statusActive") : t("statusInactive")}
              tone={category.isActive ? "primary" : "danger"}
            />
          </div>

          <dl className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
            <DetailRow label={t("tableColCategoryEn")}>
              <DetailText value={category.nameEn} lang="en" />
            </DetailRow>
            <DetailRow label={t("tableColCategoryAr")}>
              <DetailText value={category.nameAr} lang="ar" />
            </DetailRow>
            <DetailRow
              label={t("categoryProjectFormDescriptionEnLabel")}
              className="sm:col-span-2"
            >
              <DetailText value={category.descriptionEn} lang="en" />
            </DetailRow>
            <DetailRow
              label={t("categoryProjectFormDescriptionArLabel")}
              className="sm:col-span-2"
            >
              <DetailText value={category.descriptionAr} lang="ar" />
            </DetailRow>
            <DetailRow label={t("tableColCreatedAt")}>
              <DateCell value={category.createdAt} />
            </DetailRow>
          </dl>
        </div>
      )}
    </AppDialog>
  );
}
