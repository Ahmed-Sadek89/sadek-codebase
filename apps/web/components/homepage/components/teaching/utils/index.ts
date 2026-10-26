import type { InstructorExperience } from "@repo/types/instructor-experience";

/** "Mar 4, 2024" in the page's language (dates are stored at midnight UTC). */
export function formatCourseDate(value: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * How long the course ran, in the largest whole unit that fits ("3 mths",
 * "2 wks", "5 days"), written by Intl in the page's language. The end day counts.
 */
export function formatCourseDuration(course: InstructorExperience, locale: string) {
  const days =
    Math.round((Date.parse(course.endAt) - Date.parse(course.startAt)) / DAY_MS) + 1;
  const [value, unit] =
    days >= 30
      ? [Math.round(days / 30), "month"]
      : days >= 7
        ? [Math.round(days / 7), "week"]
        : [Math.max(days, 1), "day"];
  return new Intl.NumberFormat(locale, {
    style: "unit",
    unit,
    unitDisplay: "short",
  }).format(value);
}

/** "udemy.com" for a link label; the raw value if it is not a URL. */
export function getHostname(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}
