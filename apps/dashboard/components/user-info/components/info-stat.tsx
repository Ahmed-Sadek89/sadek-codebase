"use client";

import { useFormatter } from "next-intl";
import type { LucideIcon } from "@repo/ui/icons";

type InfoStatProps = {
  label: string;
  value: number;
  icon: LucideIcon;
};

/** One number card, e.g. "5 · Years of experience". */
export function InfoStat({ label, value, icon: Icon }: InfoStatProps) {
  const format = useFormatter();

  return (
    <div className="flex items-center gap-4 rounded-xl border bg-card p-4 shadow-sm sm:p-5">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="size-5" aria-hidden />
      </span>
      <div className="min-w-0">
        <p className="text-2xl font-semibold tabular-nums leading-tight">
          {format.number(value)}
        </p>
        <p className="truncate text-sm text-muted-foreground" title={label}>
          {label}
        </p>
      </div>
    </div>
  );
}
