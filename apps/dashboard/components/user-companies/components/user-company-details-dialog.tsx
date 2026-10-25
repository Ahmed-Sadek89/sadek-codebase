"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import type { UserCompanyDetails } from "@repo/types/user-company";
import { Building2 } from "@repo/ui/icons";
import { AppDialog } from "../../ui/dialog";
import { AvatarCell, DateCell, StatusBadgeCell } from "../../ui/cells";
import {
  employmentTypeLabelKey,
  locationTypeLabelKey,
} from "../utils/constants";
import { WorkPeriodCell } from "./work-period-cell";

export type UserCompanyDetailsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The row to show; kept by the caller after closing for the close animation. */
  company: UserCompanyDetails | null;
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

/** Read-only view of every field of a company, opened from the row's View action. */
export function UserCompanyDetailsDialog({
  open,
  onOpenChange,
  company,
}: UserCompanyDetailsDialogProps) {
  const t = useTranslations();

  return (
    <AppDialog
      open={open}
      onOpenChange={onOpenChange}
      className="sm:max-w-2xl max-h-[85dvh]! overflow-y-auto!"
      title={t("userCompanyDetailsTitle")}
      description={t("userCompanyDetailsDescription")}
      Icon={Building2}
    >
      {company && (
        <div className="space-y-6">
          <div className="flex items-center gap-4 rounded-lg border border-border bg-muted/30 p-4">
            <AvatarCell src={company.logo} name={company.company_name} size="lg" />
            <div className="min-w-0 flex-1 space-y-1">
              <p className="truncate text-base font-semibold" dir="auto">
                {company.company_name}
              </p>
              {company.job_title && (
                <p className="truncate text-sm text-primary" dir="auto">
                  {company.job_title}
                </p>
              )}
              <p className="text-xs text-muted-foreground tabular-nums">
                #{company.id}
              </p>
            </div>
            <StatusBadgeCell
              value={company.isActive ? t("statusActive") : t("statusInactive")}
              tone={company.isActive ? "primary" : "danger"}
            />
          </div>

          <dl className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
            <DetailRow label={t("userCompanyFormEmploymentTypeLabel")}>
              {t(employmentTypeLabelKey(company.employment_type))}
            </DetailRow>
            <DetailRow label={t("tableColWorkPeriod")}>
              <WorkPeriodCell from={company.startWorkFrom} to={company.startWorkTo} />
            </DetailRow>
            <DetailRow label={t("userCompanyFormLocationLabel")}>
              {company.location ? <span dir="auto">{company.location}</span> : EMPTY}
            </DetailRow>
            <DetailRow label={t("userCompanyFormLocationTypeLabel")}>
              {t(locationTypeLabelKey(company.location_type))}
            </DetailRow>
            <DetailRow
              label={t("userCompanyFormSiteLabel")}
              className="sm:col-span-2"
            >
              {company.company_site ? (
                <a
                  href={company.company_site}
                  target="_blank"
                  rel="noreferrer noopener"
                  dir="ltr"
                  className="break-all text-primary underline-offset-4 hover:underline"
                >
                  {company.company_site}
                </a>
              ) : (
                EMPTY
              )}
            </DetailRow>
            <DetailRow
              label={t("userCompanyFormDescriptionEnLabel")}
              className="sm:col-span-2"
            >
              <DetailText value={company.description_en} lang="en" />
            </DetailRow>
            <DetailRow
              label={t("userCompanyFormDescriptionArLabel")}
              className="sm:col-span-2"
            >
              <DetailText value={company.description_ar} lang="ar" />
            </DetailRow>
            <DetailRow label={t("tableColCreatedAt")}>
              <DateCell value={company.createdAt} />
            </DetailRow>
          </dl>
        </div>
      )}
    </AppDialog>
  );
}
