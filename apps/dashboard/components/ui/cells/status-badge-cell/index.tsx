import { cn } from "@repo/ui/utils";

export type StatusBadgeTone = "success" | "neutral" | "warning" | "danger";

export type StatusBadgeCellProps = {
  value: string;
  tone?: StatusBadgeTone;
};

// Theme tokens only; "success" uses the brand primary (there is no success token).
const TONE: Record<StatusBadgeTone, string> = {
  success: "bg-primary/10 text-primary",
  neutral: "bg-muted text-muted-foreground",
  warning: "bg-warning/10 text-warning",
  danger: "bg-danger/10 text-danger",
};

const DOT: Record<StatusBadgeTone, string> = {
  success: "bg-primary",
  neutral: "bg-muted-foreground",
  warning: "bg-warning",
  danger: "bg-danger",
};

/** Pill with a colored dot, e.g. Active / Inactive. */
export function StatusBadgeCell({
  value,
  tone = "neutral",
}: StatusBadgeCellProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        TONE[tone],
      )}
    >
      <span className={cn("size-1.5 rounded-full", DOT[tone])} aria-hidden />
      {value}
    </span>
  );
}
