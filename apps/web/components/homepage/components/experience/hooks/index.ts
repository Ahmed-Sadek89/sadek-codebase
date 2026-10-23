"use client";

import { useMemo } from "react";
import type { UserCompany } from "@repo/types/user-company";
import type { UserInfoDetails } from "@repo/types/user-info";
import { hasText } from "../../../utils";
import { sortByStartDate } from "../utils";

/**
 * The loaded companies latest job first, plus the CV link from user-info.
 * Pages are re-sorted together: the timeline stays chronological as
 * "Show more" adds older (or newer) jobs.
 */
export function useExperience(
  companies: UserCompany[],
  info: UserInfoDetails | undefined,
) {
  const sorted = useMemo(() => sortByStartDate(companies), [companies]);
  return {
    companies: sorted,
    cvUrl: hasText(info?.cv) ? info.cv : undefined,
  };
}
