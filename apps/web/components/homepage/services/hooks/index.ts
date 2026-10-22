"use client";

import { useMemo } from "react";
import { usePublicWhatCanDos } from "@repo/hooks/what-can-do";
import { whatCanDoQuery } from "../../utils";
import { sortByRank } from "../utils";

/** GET /what-can-do/public, in rank order. */
export function useServices() {
  const { data, isPending } = usePublicWhatCanDos(whatCanDoQuery);
  const services = useMemo(() => sortByRank(data?.data ?? []), [data]);
  return { services, isPending };
}
