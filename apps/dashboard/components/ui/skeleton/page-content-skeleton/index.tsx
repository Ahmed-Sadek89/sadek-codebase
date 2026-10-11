import { useTranslations } from "next-intl";
import { Skeleton } from "@repo/ui/skeleton";
import { TableContentSkeleton } from "../table-content-skeleton";

/** Route-level loading placeholder: title, description, then a table. */
export function PageContentSkeleton() {
  const t = useTranslations();

  return (
    <section className="space-y-4" aria-busy="true">
      <span className="sr-only">{t("tableLoading")}</span>
      <div className="space-y-2">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>
      <TableContentSkeleton />
    </section>
  );
}
