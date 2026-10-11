"use client";

import { useId, type TdHTMLAttributes } from "react";
import { useTranslations } from "next-intl";
import {
  createColumnHelper,
  metaHelper,
  tableFeatures,
  useTable,
  type ColumnDef,
  type RowData,
} from "@tanstack/react-table";
import { Button } from "@repo/ui/button";
import { CircleAlert, RotateCw } from "@repo/ui/icons";
import { Skeleton } from "@repo/ui/skeleton";
import { cn } from "@repo/ui/utils";
import { TABLE_CELL_CLASS_NAME } from "../../../utils/constants";

/** Per-column options, set through `meta` in a column definition. */
export type DynamicTableColumnMeta = {
  /** Extra attributes for the column's body cells, e.g. `{ lang: "ar", dir: "rtl" }`. */
  cellProps?: TdHTMLAttributes<HTMLTableCellElement>;
};

// Core features only (no sorting/filtering/pagination); typed column meta.
export const dynamicTableFeatures = tableFeatures({
  columnMeta: metaHelper<DynamicTableColumnMeta>(),
});

export type DynamicTableFeatures = typeof dynamicTableFeatures;

/** Columns for `DynamicTable`: each one sets a header name and how its cells render. */
// `any` mirrors TanStack's own helper.columns() return type: each column keeps its value type.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DynamicTableColumns<TData extends RowData> = Array<
  ColumnDef<DynamicTableFeatures, TData, any>
>;

/** Column helper bound to DynamicTable's features; build columns with it. */
export function createDynamicTableColumnHelper<TData extends RowData>() {
  return createColumnHelper<DynamicTableFeatures, TData>();
}

export type DynamicTableProps<TData extends RowData> = {
  /** Heading shown above the table; also the table's accessible name. */
  title: string;
  /** Optional short text under the title; also the table's accessible description. */
  description?: string;
  /** Header names and cell renderers. Keep the array stable (module scope or useMemo). */
  columns: DynamicTableColumns<TData>;
  /** Rows to render; `undefined` while loading. */
  data: TData[] | undefined;
  /** Stable row key; defaults to the row index. */
  getRowId?: (row: TData, index: number) => string;
  /** First load: shows skeleton rows under the real headers. */
  isLoading?: boolean;
  /** Request failed: an error panel, or a banner above rows already shown. */
  isError?: boolean;
  /** Shows a "Try again" button in the error UI, e.g. a query's `refetch`. */
  onRetry?: () => void;
  /** Overrides for the built-in translated state messages. */
  loadingMessage?: string;
  errorMessage?: string;
  emptyMessage?: string;
};

// A shared fallback keeps the data reference stable while there are no rows.
const NO_ROWS: never[] = [];
const SKELETON_ROWS = 5;

/**
 * Generic data table on TanStack Table v9: a title, an optional short
 * description, then one header cell per column and one body row per item.
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
  loadingMessage,
  errorMessage,
  emptyMessage,
}: DynamicTableProps<TData>) {
  const t = useTranslations();
  const titleId = useId();
  const descriptionId = useId();
  const table = useTable({
    features: dynamicTableFeatures,
    columns,
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
      <tr key={row.id}>
        {row.getAllCells().map((cell) => {
          const cellProps = cell.column.columnDef.meta?.cellProps;
          return (
            <td
              key={cell.id}
              {...cellProps}
              className={cn(TABLE_CELL_CLASS_NAME, cellProps?.className)}
            >
              <table.FlexRender cell={cell} />
            </td>
          );
        })}
      </tr>
    ));
  };

  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h2 id={titleId} className="text-lg font-semibold">
          {title}
        </h2>
        {description && (
          <p id={descriptionId} className="text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {isError && hasRows && (
        // A refetch failed: keep the rows already shown and say so above them.
        <div
          role="alert"
          className="flex flex-wrap items-center gap-3 rounded-lg border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger"
        >
          <CircleAlert className="size-4 shrink-0" aria-hidden />
          <p className="flex-1">{errorText}</p>
          {retryButton}
        </div>
      )}
      <div
        className="overflow-x-auto rounded-lg border border-border"
        aria-busy={showSkeleton}
      >
        <table
          aria-labelledby={titleId}
          aria-describedby={description ? descriptionId : undefined}
          className="w-full min-w-3xl border-collapse text-sm"
        >
          {showSkeleton && (
            <caption className="sr-only">
              {loadingMessage ?? t("tableLoading")}
            </caption>
          )}
          <thead className="bg-muted/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    scope="col"
                    colSpan={header.colSpan}
                    className={cn(TABLE_CELL_CLASS_NAME, "font-medium")}
                  >
                    {header.isPlaceholder ? null : (
                      <table.FlexRender header={header} />
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>{renderBody()}</tbody>
        </table>
      </div>
    </section>
  );
}
