import { useLocale, useTranslations } from "next-intl";
import type { UserCompany } from "@repo/types/user-company";
import {
  BriefcaseBusiness,
  CalendarDays,
  ExternalLink,
  MapPin,
} from "@repo/ui/icons";
import { cn } from "@repo/ui/utils";
import { localize } from "../../../../../utils/localize";
import {
  EMPLOYMENT_TYPE_LABEL_KEYS,
  formatDuration,
  formatWorkPeriod,
  getHostname,
  LOCATION_TYPE_LABEL_KEYS,
} from "../utils";
import { CompanyLogo } from "./company-logo";
import { TimelineNode } from "./timeline-node";

const CHIP_CLASS_NAME =
  "inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1 text-xs font-medium text-muted-foreground";

/**
 * One job on the timeline. Small screens: every card beside a line at the
 * start. Large screens: a centre line with cards alternating sides (`flip`).
 * The card leads with the logo, the job title and the company; the period,
 * employment type and location follow as chips.
 */
export function TimelineItem({
  company,
  flip,
}: {
  company: UserCompany;
  flip: boolean;
}) {
  const t = useTranslations();
  const locale = useLocale();
  const name = company.company_name;
  // Rows saved before job titles existed lead with the company name instead.
  const title = company.job_title || name;
  const description = localize(
    locale,
    company.description_en,
    company.description_ar,
  );
  const isCurrent = company.startWorkTo === null;
  const duration = formatDuration(company, locale);
  const locationType = t(LOCATION_TYPE_LABEL_KEYS[company.location_type]);
  return (
    <li className="group/item relative grid pb-10 ps-14 last:pb-0 sm:ps-20 lg:grid-cols-2 lg:gap-16 lg:ps-0">
      {/* Node on the start line (small) or the centre line (large). */}
      <TimelineNode
        className="start-0 sm:start-1 lg:start-auto lg:left-1/2 lg:-translate-x-1/2"
        isCurrent={isCurrent}
      />
      <article
        className={cn(
          "group relative overflow-hidden rounded-2xl border bg-card p-5 shadow-sm transition duration-300 animate-in fade-in slide-in-from-bottom-2 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 motion-reduce:animate-none motion-reduce:hover:translate-y-0 sm:p-6",
          isCurrent ? "border-primary/30" : "border-border",
          flip && "lg:col-start-2",
        )}
      >
        {/* Accent along the card's top edge; always on for the current job. */}
        <span
          aria-hidden="true"
          className={cn(
            "absolute inset-x-0 top-0 h-1 bg-linear-to-r from-primary via-primary/60 to-transparent transition-opacity duration-300",
            isCurrent ? "opacity-100" : "opacity-0 group-hover:opacity-100",
          )}
        />
        <header className="flex items-start gap-4">
          <CompanyLogo logo={company.logo} name={name} />
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <h3
                className="text-lg leading-snug font-bold text-foreground sm:text-xl"
                dir="auto"
              >
                {title}
              </h3>
              {isCurrent && (
                <span className="mt-1 inline-flex shrink-0 items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-2.5 py-0.5 text-[11px] font-semibold text-success">
                  <span
                    aria-hidden="true"
                    className="size-1.5 animate-pulse rounded-full bg-success motion-reduce:animate-none"
                  />
                  {t("experiencePresent")}
                </span>
              )}
            </div>
            <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm">
              {company.job_title && (
                <span className="font-semibold text-primary" dir="auto">
                  {name}
                </span>
              )}
              {company.job_title && company.company_site && (
                <span aria-hidden="true" className="text-border-strong">
                  •
                </span>
              )}
              {company.company_site && (
                <a
                  className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground no-underline transition-colors hover:text-primary"
                  dir="ltr"
                  href={company.company_site}
                  rel="noreferrer"
                  target="_blank"
                >
                  {getHostname(company.company_site)}
                  <ExternalLink aria-hidden="true" className="size-3" />
                </a>
              )}
            </p>
          </div>
        </header>
        <ul className="mt-4 flex flex-wrap items-center gap-2">
          <li className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
            <CalendarDays aria-hidden="true" className="size-3.5" />
            {formatWorkPeriod(company, locale, t("experiencePresent"))}
            {duration && (
              <span className="font-medium text-primary/70">· {duration}</span>
            )}
          </li>
          <li className={CHIP_CLASS_NAME}>
            <BriefcaseBusiness aria-hidden="true" className="size-3.5" />
            {t(EMPLOYMENT_TYPE_LABEL_KEYS[company.employment_type])}
          </li>
          <li className={CHIP_CLASS_NAME}>
            <MapPin aria-hidden="true" className="size-3.5" />
            <span dir="auto">
              {company.location
                ? `${company.location} · ${locationType}`
                : locationType}
            </span>
          </li>
        </ul>
        {description && (
          <p className="mt-4 border-t border-border pt-4 text-sm leading-[1.8] whitespace-pre-line text-muted-foreground">
            {description}
          </p>
        )}
      </article>
    </li>
  );
}
