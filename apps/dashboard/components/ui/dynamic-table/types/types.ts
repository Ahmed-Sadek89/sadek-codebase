import type { TdHTMLAttributes } from "react";
import type { ColumnDef, DeepKeys, RowData } from "@tanstack/react-table";
import type { DynamicTableFeatures } from "../features";

/** Logical edge a column sticks to while the table scrolls sideways (flips in RTL). */
export type StickySide = "start" | "end";

/** Per-column options, set through `meta` in a column definition. */
export type DynamicTableColumnMeta = {
  /** Extra attributes for the column's body cells, e.g. `{ lang: "ar", dir: "rtl" }`. */
  cellProps?: TdHTMLAttributes<HTMLTableCellElement>;
};

/**
 * One column, written as a plain object: `{ accessorKey | accessorFn | id,
 * header, cell, meta? }`, plus `sticky` to pin it (e.g. actions at "end").
 */
export type DynamicColumnDef<
  TData extends RowData,
  TValue = unknown,
> = ColumnDef<DynamicTableFeatures, TData, TValue> & {
  /** Narrowed from TanStack's `string` so a misspelled key is a type error. */
  accessorKey?: DeepKeys<TData>;
  sticky?: StickySide;
};

/** Paging info from a paginated response (`PaginatedResponse` minus `data`). */
export type DynamicTablePagination = {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
};

export type DynamicTableProps<TData extends RowData> = {
  /** Heading shown above the table; also the table's accessible name. */
  title: string;
  /** Optional short text under the title; also the table's accessible description. */
  description?: string;
  /** Header names and cell renderers. Keep the array stable (useMemo). */
  columns: DynamicColumnDef<TData>[];
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
  /**
   * Show the search box (default true). It writes `?search=` to the URL
   * (debounced 400 ms); read it with `useSearchParams` and pass it to the query.
   */
  showSearch?: boolean;
  /** Show the Reload button (default true); it needs `onReload`. */
  showReload?: boolean;
  /** Reload button handler, e.g. a query's `refetch`. */
  onReload?: () => void;
  /** A request is in flight (e.g. `isFetching`): spins and disables Reload. */
  isRefreshing?: boolean;
  /**
   * Paging info (pass the paginated response). Adds a footer with a range
   * summary, a rows-per-page select (`?limit=`), and pagination (`?page=`).
   */
  pagination?: DynamicTablePagination;
  /** Overrides for the built-in translated state messages. */
  loadingMessage?: string;
  errorMessage?: string;
  emptyMessage?: string;
  showCreate?: boolean
  makeCreateAction?: () => void

};
