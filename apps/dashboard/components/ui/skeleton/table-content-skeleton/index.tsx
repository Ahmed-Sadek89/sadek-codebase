import { useTranslations } from "next-intl";
import { Skeleton } from "@repo/ui/skeleton";
import { TABLE_CELL_CLASS_NAME } from "../../../../utils/constants";

const COLUMNS = 6;
const ROWS = 5;

/** Loading placeholder for any data table: skeleton headers and body cells. */
export function TableContentSkeleton() {
  const t = useTranslations();
  const columns = Array.from({ length: COLUMNS }, (_, column) => column);

  return (
    <div
      className="overflow-x-auto rounded-lg border border-border"
      aria-busy="true"
    >
      <table className="w-full min-w-3xl border-collapse text-sm">
        <caption className="sr-only">{t("tableLoading")}</caption>
        <thead className="bg-muted/50">
          <tr>
            {columns.map((column) => (
              <th key={column} scope="col" className={TABLE_CELL_CLASS_NAME}>
                <Skeleton className="h-4 w-2/3" />
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
  );
}
