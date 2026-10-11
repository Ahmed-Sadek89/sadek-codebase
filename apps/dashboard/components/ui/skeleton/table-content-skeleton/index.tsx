import { useTranslations } from "next-intl";
import { Skeleton } from "@repo/ui/skeleton";
import { TABLE_CELL_CLASS_NAME } from "../../../../utils/constants";

const COLUMNS = 6;
const ROWS = 10;

/**
 * Loading placeholder shaped like DynamicTable's card: a header (title,
 * description, search, refresh), skeleton column headers, and body cells.
 */
export function TableContentSkeleton() {
  const t = useTranslations();
  const columns = Array.from({ length: COLUMNS }, (_, column) => column);

  return (
    <section
      className="overflow-hidden rounded-xl border border-border bg-card shadow-sm"
      aria-busy="true"
    >
      <span className="sr-only">{t("tableLoading")}</span>
      <div className="flex flex-col gap-4 border-b border-border p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-72 max-w-full" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-full lg:w-64" />
          <Skeleton className="h-9 w-9 shrink-0 sm:w-24" />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-3xl border-collapse text-sm [&_tbody_tr:last-child_td]:border-b-0">
          <thead className="bg-muted/50">
            <tr>
              {columns.map((column) => (
                <th key={column} scope="col" className={TABLE_CELL_CLASS_NAME}>
                  <Skeleton className="h-3 w-2/3" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: ROWS }, (_, row) => (
              <tr key={row}>
                {columns.map((column) => (
                  <td key={column} className={TABLE_CELL_CLASS_NAME}>
                    <Skeleton className="h-4 w-full" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
