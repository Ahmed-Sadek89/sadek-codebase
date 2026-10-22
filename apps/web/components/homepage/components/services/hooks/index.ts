"use client";

import { useMemo } from "react";
import type { WhatCanDo } from "@repo/types/what-can-do";
import { sortByRank } from "../utils";

/** The services in rank order. */
export function useSortedServices(services: WhatCanDo[]) {
  return useMemo(() => sortByRank(services), [services]);
}
