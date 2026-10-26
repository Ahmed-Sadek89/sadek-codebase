const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * The teaching period's length in the largest whole unit that fits:
 * months from 30 days, weeks from 7, otherwise days (at least 1, since the
 * end day counts).
 */
export function getDuration(
  startAt: string,
  endAt: string,
): { unit: "months" | "weeks" | "days"; count: number } {
  const days =
    Math.round((new Date(endAt).getTime() - new Date(startAt).getTime()) / DAY_MS) + 1;
  if (days >= 30) return { unit: "months", count: Math.round(days / 30) };
  if (days >= 7) return { unit: "weeks", count: Math.round(days / 7) };
  return { unit: "days", count: Math.max(days, 1) };
}
