import type { ReactNode, TdHTMLAttributes } from "react";
import type { LucideIcon } from "@repo/ui/icons";
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
 * header, cell, sortable, meta? }`, plus `sticky` to pin it (e.g. actions at "end").
 */
export type DynamicColumnDef<
  TData extends RowData,
  TValue = unknown,
> = ColumnDef<DynamicTableFeatures, TData, TValue> & {
  /** Narrowed from TanStack's `string` so a misspelled key is a type error. */
  accessorKey?: DeepKeys<TData>;
  /**
   * Clicking the header sorts the shown rows by this column (asc, desc, off).
   * Needs a value to sort by (`accessorKey` or `accessorFn`).
   */
  sortable: boolean;
  sticky?: StickySide;
};

/** One chip in a static filter. */
export type StaticFilterOption = {
  /** null is the "all" chip: selected while the param is unset. */
  value: string | null;
  label: string;
  icon?: LucideIcon;
};

/**
 * A fixed set of chips under the table header, bound to one URL query param
 * (e.g. a page's `useStaticFilter`). At most one chip is selected; none means the
 * backend default.
 */
export type StaticFilter = {
  /** URL query param the chips write. */
  paramName: string;
  /** Group label shown before the chips. */
  label: string;
  icon?: LucideIcon;
  options: StaticFilterOption[];
  /** The selected option's value, or null when the param is unset. */
  value: string | null;
  /** Selects an option; null (or the selected one again) clears the param. */
  onChange: (value: string | null) => void;
};

/**
 * A filter input (e.g. a searchable select) shown in the row under the static
 * filters; it reads and writes its own URL query param (e.g. the skills
 * page's `useDynamicFilter`).
 */
export type DynamicFilter = {
  /** URL query param the input writes; also the React key. */
  paramName: string;
  /** Label shown before the input. */
  label: string;
  icon?: LucideIcon;
  /** The input element, already bound to its value and onChange. */
  content: ReactNode;
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
  /** Chip filters shown under the header, e.g. from `useStaticFilter()`. */
  staticFilter?: StaticFilter[];
  /** Filter inputs shown under the static filters, e.g. from `useDynamicFilter()`. */
  dynamicFilter?: DynamicFilter[];

};
