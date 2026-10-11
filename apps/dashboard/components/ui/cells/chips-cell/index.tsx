import { useTranslations } from "next-intl";

export type ChipsCellProps = {
  values: string[];
  /** Chips shown before the rest collapse into "+N". */
  max?: number;
  /** Shown when there are no values; defaults to an em dash. */
  fallback?: string;
};

/** A wrapping row of small chips, e.g. a skill's categories. */
export function ChipsCell({ values, max = 3, fallback = "—" }: ChipsCellProps) {
  const t = useTranslations();
  if (values.length === 0)
    return <span className="text-sm text-muted-foreground">{fallback}</span>;

  const shown = values.slice(0, max);
  const hidden = values.slice(max);

  return (
    <ul className="flex max-w-xs min-w-40 flex-wrap gap-1.5">
      {shown.map((value, index) => (
        <li
          key={`${value}-${index}`}
          dir="auto"
          className="max-w-full truncate rounded-full border border-border bg-muted/60 px-2 py-0.5 text-xs font-medium text-foreground"
        >
          {value}
        </li>
      ))}
      {hidden.length > 0 && (
        <li
          title={hidden.join(", ")}
          aria-label={t("chipsMore", { count: hidden.length })}
          className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
        >
          +{hidden.length}
        </li>
      )}
    </ul>
  );
}
