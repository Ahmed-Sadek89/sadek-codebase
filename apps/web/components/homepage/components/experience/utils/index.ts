import { EmploymentType, LocationType } from "@repo/constants/user-company";
import type { UserCompany } from "@repo/types/user-company";
import type { MessageKey } from "../../../../../i18n/types";

/** Each location type's label; a `Record`, so a new type needs one. */
export const LOCATION_TYPE_LABEL_KEYS: Record<LocationType, MessageKey> = {
  [LocationType.REMOTE]: "experienceLocationTypeRemote",
  [LocationType.ONSITE]: "experienceLocationTypeOnsite",
  [LocationType.HYBRID]: "experienceLocationTypeHybrid",
};

/** Each employment type's label; a `Record`, so a new type needs one. */
export const EMPLOYMENT_TYPE_LABEL_KEYS: Record<EmploymentType, MessageKey> = {
  [EmploymentType.FULL_TIME]: "experienceEmploymentTypeFullTime",
  [EmploymentType.PART_TIME]: "experienceEmploymentTypePartTime",
  [EmploymentType.FREELANCE]: "experienceEmploymentTypeFreelance",
  [EmploymentType.INTERNSHIP]: "experienceEmploymentTypeInternship",
};

/** The public list sorts by `createdAt`; the timeline shows the latest job first. */
export function sortByStartDate(companies: UserCompany[]) {
  return [...companies].sort(
    (a, b) => Date.parse(b.startWorkFrom) - Date.parse(a.startWorkFrom),
  );
}

/** "example.com" for a company site link; the raw value if it is not a URL. */
export function getHostname(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

/**
 * "Mar 2022 — Present" in the page's language (`startWorkTo: null` means a
 * current job, shown as `presentLabel`).
 */
export function formatWorkPeriod(
  company: UserCompany,
  locale: string,
  presentLabel: string,
) {
  const monthYear = new Intl.DateTimeFormat(locale, {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
  const from = monthYear.format(new Date(company.startWorkFrom));
  const to = company.startWorkTo
    ? monthYear.format(new Date(company.startWorkTo))
    : presentLabel;
  return `${from} — ${to}`;
}

/**
 * How long the job lasted (or has lasted), in whole months, written in the
 * page's language by Intl: "2 yrs, 3 mths", "٨ أشهر"... Empty under a month.
 */
export function formatDuration(company: UserCompany, locale: string) {
  const from = new Date(company.startWorkFrom);
  const to = company.startWorkTo ? new Date(company.startWorkTo) : new Date();
  const total =
    (to.getUTCFullYear() - from.getUTCFullYear()) * 12 +
    (to.getUTCMonth() - from.getUTCMonth());
  const years = Math.floor(total / 12);
  const months = total % 12;
  const unit = (value: number, kind: "year" | "month") =>
    new Intl.NumberFormat(locale, {
      style: "unit",
      unit: kind,
      unitDisplay: "short",
    }).format(value);
  const parts = [
    years > 0 ? unit(years, "year") : null,
    months > 0 ? unit(months, "month") : null,
  ].filter((part) => part !== null);
  return new Intl.ListFormat(locale, { type: "unit", style: "short" }).format(
    parts,
  );
}
