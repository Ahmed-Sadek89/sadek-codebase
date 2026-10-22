import type { UserCompany } from "@repo/types/user-company";

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
