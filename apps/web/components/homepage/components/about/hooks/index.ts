"use client";

import { useLocale } from "next-intl";
import type { UserInfoDetails } from "@repo/types/user-info";
import { localize } from "../../../../../utils/localize";
import { getStats } from "../utils";

export function useAboutContent(info: UserInfoDetails | undefined) {
  const locale = useLocale();
  return {
    description:
      info && localize(locale, info.description_en, info.description_ar),
    stats: info ? getStats(info) : [],
  };
}
