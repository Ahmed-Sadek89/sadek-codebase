import { cn } from "@repo/ui/utils";

export type TextCellProps = {
  value: string | number | null | undefined;
  weight?: "normal" | "medium" | "semibold";
  tone?: "default" | "muted";
  size?: "sm" | "base";
  /** Shown when `value` is empty; defaults to an em dash. */
  fallback?: string;
  className?: string;
};

const WEIGHT = {
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
} as const;

/** One line of table text. `dir="auto"` lets mixed Arabic/English text pick its own direction. */
export function TextCell({
  value,
  weight = "normal",
  tone = "default",
  size = "base",
  fallback = "—",
  className,
}: TextCellProps) {
  const text = value === null || value === undefined ? "" : String(value);

  return (
    <p
      dir="auto"
      className={cn(
        "truncate",
        WEIGHT[weight],
        tone === "muted" ? "text-muted-foreground" : "text-foreground",
        size === "sm" ? "text-xs" : "text-sm",
        className,
      )}
      title={text || undefined}
    >
      {text || fallback}
    </p>
  );
}
