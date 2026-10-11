"use client";

import { useId, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useTable, type RowData } from "@tanstack/react-table";
import { Button } from "@repo/ui/button";
import { Card, CardContent } from "@repo/ui/card";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  CircleAlert,
  RotateCw,
} from "@repo/ui/icons";
import { Skeleton } from "@repo/ui/skeleton";
import { cn } from "@repo/ui/utils";
import { DynamicTableHeader } from "./components/table-header";
import { TablePagination } from "./components/table-pagination";
import { TableRowsSelect } from "./components/table-rows-select";
import { dynamicTableFeatures } from "./features";
import type {
  DynamicColumnDef,
  DynamicTableProps,
  StickySide,
} from "./types/types";
import { TABLE_CELL_CLASS_NAME } from "../../../utils/constants";

export { dynamicTableFeatures, type DynamicTableFeatures } from "./features";
export type * from "./types/types";

/** Reads `sticky` from a column definition (TanStack keeps the original object). */
function stickySide(columnDef: unknown): StickySide | undefined {
  return (columnDef as Pick<DynamicColumnDef<RowData>, "sticky">).sticky;
}

// Opaque backgrounds so scrolled cells do not show through a pinned column.
const STICKY_CLASS: Record<StickySide, string> = {
  start: "sticky start-0 z-10 border-e border-border",
  end: "sticky end-0 z-10 border-s border-border",
};

// A shared fallback keeps the data reference stable while there are no rows.
const NO_ROWS: never[] = [];
const SKELETON_ROWS = 5;

/**
 * Generic data table on TanStack Table v9, laid out as a card: a header
 * (title, count badge, description, search, refresh), one header cell per
 * column and one body row per item, then a pagination footer.
 *
 * States: loading (no rows yet) shows skeleton rows; an error with no rows
 * shows an error panel; an error while rows are shown keeps them and adds a
 * banner; no rows otherwise shows the empty message. `onRetry` adds a retry
 * button to both error UIs.
 */
export function DynamicTable<TData extends RowData>({
  title,
  description,
  columns,
  data,
  getRowId,
  isLoading = false,
  isError = false,
  onRetry,
  showSearch = true,
  showReload = true,
  onReload,
  isRefreshing = false,
  showCreate = false,
  pagination,
  loadingMessage,
  errorMessage,
  emptyMessage,
  makeCreateAction = () => { }
}: DynamicTableProps<TData>) {
  const t = useTranslations();
  const titleId = useId();
  const descriptionId = useId();
  // `sortable` is the only switch: TanStack reads it as `enableSorting`.
  const tableColumns = useMemo(
    () =>
      columns.map((column) => ({ ...column, enableSorting: column.sortable })),
    [columns],
  );
  const table = useTable({
    features: dynamicTableFeatures,
    columns: tableColumns,
    data: data ?? NO_ROWS,
    getRowId,
  });
  const rows = table.getRowModel().rows;
  const columnCount = table.getAllLeafColumns().length;
  const hasRows = rows.length > 0;
  const showSkeleton = isLoading && !hasRows;
  const errorText = errorMessage ?? t("tableError");

  const retryButton = onRetry && (
    <Button type="button" variant="ghost" size="sm" onClick={onRetry}>
      <RotateCw className="size-4" aria-hidden />
      {t("tableRetry")}
    </Button>
  );

  const renderBody = () => {
    if (showSkeleton) {
      return Array.from({ length: SKELETON_ROWS }, (_, row) => (
        <tr key={row}>
          {Array.from({ length: columnCount }, (_, column) => (
            <td key={column} className={TABLE_CELL_CLASS_NAME}>
              <Skeleton className="h-4 w-full" />
            </td>
          ))}
        </tr>
      ));
    }

    if (isError && !hasRows) {
      return (
        <tr>
          <td colSpan={columnCount} className={TABLE_CELL_CLASS_NAME}>
            <div
              role="alert"
              className="flex flex-col items-center gap-3 py-8 text-center"
            >
              <CircleAlert className="size-8 text-danger" aria-hidden />
              <p className="text-danger">{errorText}</p>
              {retryButton}
            </div>
          </td>
        </tr>
      );
    }

    if (!hasRows) {
      return (
        <tr>
          <td
            colSpan={columnCount}
            className={cn(
              TABLE_CELL_CLASS_NAME,
              "py-8 text-center text-muted-foreground",
            )}
          >
            {emptyMessage ?? t("tableEmpty")}
          </td>
        </tr>
      );
    }

    return rows.map((row) => (
      <tr key={row.id} className="group transition-colors hover:bg-muted/40">
        {row.getAllCells().map((cell) => {
          const cellProps = cell.column.columnDef.meta?.cellProps;
          const sticky = stickySide(cell.column.columnDef);
          return (
            <td
              key={cell.id}
              {...cellProps}
              className={cn(
                TABLE_CELL_CLASS_NAME,
                sticky &&
                cn(STICKY_CLASS[sticky], "bg-card group-hover:bg-muted"),
                cellProps?.className,
              )}
            >
              <table.FlexRender cell={cell} />
            </td>
          );
        })}
      </tr>
    ));
  };

  const showFooter = pagination && pagination.total > 0 && !showSkeleton;

  return (
    <Card className="w-full min-w-0 gap-0 overflow-hidden py-0">
      <DynamicTableHeader
        titleId={titleId}
        descriptionId={descriptionId}
        title={title}
        description={description}
        total={showSkeleton ? undefined : pagination?.total}
        showSearch={showSearch}
        onReload={showReload ? onReload : undefined}
        isRefreshing={isRefreshing}
        showCreate={showCreate}
        makeCreateAction={makeCreateAction}
      />
      {isError && hasRows && (
        // A refetch failed: keep the rows already shown and say so above them.
        <div
          role="alert"
          className="flex flex-wrap items-center gap-3 border-b border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger sm:px-5"
        >
          <CircleAlert className="size-4 shrink-0" aria-hidden />
          <p className="flex-1">{errorText}</p>
          {retryButton}
        </div>
      )}
      <CardContent className="overflow-x-auto px-0" aria-busy={showSkeleton}>
        <table
          aria-labelledby={titleId}
          aria-describedby={description ? descriptionId : undefined}
          className="w-full min-w-3xl border-collapse text-sm [&_tbody_tr:last-child_td]:border-b-0"
        >
          {showSkeleton && (
            <caption className="sr-only">
              {loadingMessage ?? t("tableLoading")}
            </caption>
          )}
          <thead className="bg-muted/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const sorted = header.column.getIsSorted();
                  const SortIcon =
                    sorted === "asc"
                      ? ArrowUp
                      : sorted === "desc"
                        ? ArrowDown
                        : ArrowUpDown;
                  return (
                    <th
                      key={header.id}
                      scope="col"
                      colSpan={header.colSpan}
                      aria-sort={
                        sorted === "asc"
                          ? "ascending"
                          : sorted === "desc"
                            ? "descending"
                            : canSort
                              ? "none"
                              : undefined
                      }
                      className={cn(
                        TABLE_CELL_CLASS_NAME,
                        "text-xs font-medium uppercase tracking-wide text-muted-foreground",
                        stickySide(header.column.columnDef) &&
                        cn(
                          STICKY_CLASS[stickySide(header.column.columnDef)!],
                          "bg-muted",
                        ),
                      )}
                    >
                      {header.isPlaceholder ? null : canSort ? (
                        <button
                          type="button"
                          onClick={header.column.getToggleSortingHandler()}
                          className={cn(
                            "inline-flex items-center gap-1 uppercase tracking-wide transition-colors hover:text-foreground",
                            sorted && "text-foreground",
                          )}
                        >
                          <table.FlexRender header={header} />
                          <SortIcon className="size-3.5 shrink-0" aria-hidden />
                        </button>
                      ) : (
                        <table.FlexRender header={header} />
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>{renderBody()}</tbody>
        </table>
      </CardContent>
      {showFooter && (
        <footer className="flex flex-col-reverse items-center gap-3 border-t border-border px-4 py-3 sm:flex-row sm:justify-between sm:px-5">
          <div className="flex flex-wrap items-center gap-4">
            <TableRowsSelect limit={pagination.limit} />
            <p className="text-sm text-muted-foreground" aria-live="polite">
              {t("tableRange", {
                from: Math.min(
                  (pagination.page - 1) * pagination.limit + 1,
                  pagination.total,
                ),
                to: Math.min(
                  pagination.page * pagination.limit,
                  pagination.total,
                ),
                total: pagination.total,
              })}
            </p>
          </div>
          {pagination.totalPage > 1 && (
            <TablePagination
              page={pagination.page}
              totalPage={pagination.totalPage}
            />
          )}
        </footer>
      )}
    </Card>
  );
}
