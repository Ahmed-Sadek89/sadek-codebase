import {
  createSortedRowModel,
  metaHelper,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_basic,
  sortFn_datetime,
  sortFn_text,
  tableFeatures,
} from "@tanstack/react-table";
import type { DynamicTableColumnMeta } from "./types/types";

// Core features plus client-side sorting (per column via `sortable`); typed column meta.
export const dynamicTableFeatures = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  // The ones the "auto" sort picks from, by the column's sampled values.
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    basic: sortFn_basic,
    datetime: sortFn_datetime,
    text: sortFn_text,
  },
  columnMeta: metaHelper<DynamicTableColumnMeta>(),
});

export type DynamicTableFeatures = typeof dynamicTableFeatures;
