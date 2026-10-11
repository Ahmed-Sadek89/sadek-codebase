import { useFormatter } from "next-intl";
import { cn } from "@repo/ui/utils";

export type DateCellProps = {
  /** ISO string, timestamp or Date; empty shows the fallback. */
  value: string | number | Date | null | undefined;
  /** Shown when `value` is empty or invalid; defaults to an em dash. */
  fallback?: string;
  className?: string;
};

// Date and time in the current locale with the month's name (some locales,
// e.g. Arabic, use only numbers for `dateStyle: "medium"`), on a 12-hour clock.
const DATE_TIME_FORMAT = {
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
} as const;

/** A date and time (12 h) formatted for the current locale, e.g. "October 11, 2026 at 3:05 PM". */
export function DateCell({ value, fallback = "—", className }: DateCellProps) {
  const format = useFormatter();
  const date = value === null || value === undefined ? null : new Date(value);
  const isValid = date !== null && !Number.isNaN(date.getTime());
  const text = isValid ? format.dateTime(date, DATE_TIME_FORMAT) : "";

  return (
    <time
      dateTime={isValid ? date.toISOString() : undefined}
      title={text || undefined}
      className={cn("block text-sm whitespace-nowrap text-foreground", className)}
    >
      {text || fallback}
    </time>
  );
}
