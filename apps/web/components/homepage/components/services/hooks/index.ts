"use client";

import { useMemo } from "react";
import { useLocale } from "next-intl";
import type { WhatCanDo } from "@repo/types/what-can-do";
import { toServiceItem } from "../utils";

/**
 * The loaded services, ready for the accordion. Kept in API order: pages
 * append as "Show more" loads them, so earlier items never move.
 */
export function useServiceItems(services: WhatCanDo[]) {
  const locale = useLocale();
  return useMemo(
    () =>
      services.map((service, index) => toServiceItem(service, index, locale)),
    [services, locale],
  );
}
