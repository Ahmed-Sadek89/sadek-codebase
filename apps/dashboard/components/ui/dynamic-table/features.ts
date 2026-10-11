import { metaHelper, tableFeatures } from "@tanstack/react-table";
import type { DynamicTableColumnMeta } from "./types/types";

// Core features only (no sorting/filtering/pagination); typed column meta.
export const dynamicTableFeatures = tableFeatures({
  columnMeta: metaHelper<DynamicTableColumnMeta>(),
});

export type DynamicTableFeatures = typeof dynamicTableFeatures;
