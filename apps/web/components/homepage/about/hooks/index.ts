"use client";

import { usePortfolioInfo } from "../../hooks";
import { getStats } from "../utils";

export function useAboutContent() {
  const { info, isPending } = usePortfolioInfo();
  return {
    description: info?.description_en,
    stats: info ? getStats(info) : [],
    isPending,
  };
}
