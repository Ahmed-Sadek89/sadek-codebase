import { useLocale, useTranslations } from "next-intl";
import type { UserCompany } from "@repo/types/user-company";
import { CalendarDays, ExternalLink } from "@repo/ui/icons";
import { cn } from "@repo/ui/utils";
import { localize } from "../../../../../utils/localize";
import { formatDuration, formatWorkPeriod, getHostname } from "../utils";
import { TimelineNode } from "./timeline-node";

/**
 * One job on the timeline. Small screens: every card beside a line at the
 * start. Large screens: a centre line with cards alternating sides (`flip`).
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
  const description = localize(
    locale,
    company.description_en,
    company.description_ar,
  );
  const isCurrent = company.startWorkTo === null;
  const duration = formatDuration(company, locale);
  return (
    <li className="relative grid pb-10 ps-14 last:pb-0 sm:ps-20 lg:grid-cols-2 lg:gap-16 lg:ps-0">
      {/* Node on the start line (small) or the centre line (large). */}
      <TimelineNode
        className="start-0 sm:start-1 lg:start-auto lg:left-1/2 lg:-translate-x-1/2"
        isCurrent={isCurrent}
        logo={company.logo}
        name={name}
      />
      <article
        className={cn(
          "group relative rounded-2xl border border-border bg-card p-5 shadow-sm transition duration-300 animate-in fade-in slide-in-from-bottom-2 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 motion-reduce:animate-none sm:p-6",
          flip && "lg:col-start-2",
        )}
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <CalendarDays aria-hidden="true" className="size-3.5" />
            {formatWorkPeriod(company, locale, t("experiencePresent"))}
          </span>
          {duration && (
            <span className="text-xs text-muted-foreground">{duration}</span>
          )}
          {isCurrent && (
            <span className="ms-auto inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-2.5 py-0.5 text-[11px] font-semibold text-success">
              <span
                aria-hidden="true"
                className="size-1.5 rounded-full bg-success"
              />
              {t("experiencePresent")}
            </span>
          )}
        </div>
        <h3 className="mt-3 text-lg font-bold text-foreground sm:text-xl">
          {name}
        </h3>
        {company.company_site && (
          <a
            className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground no-underline transition-colors hover:text-primary"
            dir="ltr"
            href={company.company_site}
            rel="noreferrer"
            target="_blank"
          >
            {getHostname(company.company_site)}
            <ExternalLink aria-hidden="true" className="size-3" />
          </a>
        )}
        {description && (
          <p className="mt-3 text-sm leading-[1.8] whitespace-pre-line text-muted-foreground">
            {description}
          </p>
        )}
      </article>
    </li>
  );
}
