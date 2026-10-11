import { useTranslations } from "next-intl";
import { Skeleton } from "@repo/ui/skeleton";

/** Varied label widths so the rows read as a list, not a block. */
const LABEL_WIDTHS = ["w-3/4", "w-1/2", "w-2/3", "w-2/5", "w-3/5"];

/**
 * Loading rows for a select's option list (`<li>`s, so render it inside the
 * `<ul>`): a box and a label bar per row, plus a screen-reader message.
 */
export function OptionsSkeleton({ rows = 5 }: { rows?: number }) {
  const t = useTranslations();
  return (
    <>
      <li className="sr-only">{t("multiSelectLoading")}</li>
      {Array.from({ length: rows }, (_, row) => (
        <li
          key={row}
          aria-hidden
          className="flex items-center gap-2 px-2 py-2"
        >
          <Skeleton className="size-4 shrink-0 rounded-[4px]" />
          <Skeleton
            className={`h-3.5 ${LABEL_WIDTHS[row % LABEL_WIDTHS.length]}`}
          />
        </li>
      ))}
    </>
  );
}
