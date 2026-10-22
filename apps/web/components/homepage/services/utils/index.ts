import type { WhatCanDo } from "@repo/types/what-can-do";

/** The public list sorts by `createdAt`; the portfolio shows items by `rank`, ties by `id`. */
export function sortByRank(items: WhatCanDo[]) {
  return [...items].sort((a, b) => a.rank - b.rank || a.id - b.id);
}

/** "01", "02", ... for the row index. */
export function formatIndex(index: number) {
  return String(index + 1).padStart(2, "0");
}
