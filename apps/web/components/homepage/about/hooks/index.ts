"use client";

import { useLocale } from "next-intl";
import { localize } from "../../../../utils/localize";
import { usePortfolioInfo } from "../../hooks";
import { getStats } from "../utils";

export function useAboutContent() {
  const locale = useLocale();
  const { info, isPending } = usePortfolioInfo();
  return {
    description:
      info && localize(locale, info.description_en, info.description_ar),
    stats: info ? getStats(info) : [],
    isPending,
  };
}
