"use client";

import { useMemo } from "react";
import type { UserCompany } from "@repo/types/user-company";
import type { UserInfoDetails } from "@repo/types/user-info";
import { hasText } from "../../../utils";
import { sortByStartDate } from "../utils";

/** The companies latest first, plus the CV link from user-info. */
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
