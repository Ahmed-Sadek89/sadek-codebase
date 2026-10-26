"use client";

import { useFormatter } from "next-intl";
import { cn } from "@repo/ui/utils";

const DATE_FORMAT = { day: "numeric", month: "short", year: "numeric" } as const;

type TeachingPeriodProps = {
  startAt: string;
  endAt: string;
  className?: string;
};

/** "Mar 4, 2024 – Jun 1, 2024" in the current locale, on one line. */
export function TeachingPeriod({ startAt, endAt, className }: TeachingPeriodProps) {
  const format = useFormatter();
  const start = new Date(startAt);
  const end = new Date(endAt);

  return (
    <span className={cn("block text-sm whitespace-nowrap", className)}>
      <time dateTime={start.toISOString()}>{format.dateTime(start, DATE_FORMAT)}</time>
      <span className="px-1.5 text-muted-foreground" aria-hidden>
        –
      </span>
      <time dateTime={end.toISOString()}>{format.dateTime(end, DATE_FORMAT)}</time>
    </span>
  );
}
