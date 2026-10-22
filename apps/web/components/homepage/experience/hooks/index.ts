"use client";

import { useMemo } from "react";
import { usePublicUserCompanies } from "@repo/hooks/user-company";
import { usePortfolioInfo } from "../../hooks";
import { hasText, userCompanyQuery } from "../../utils";
import { sortByStartDate } from "../utils";

/** GET /user-company/public (latest first) plus the CV link from user-info. */
export function useExperience() {
  const { data, isPending } = usePublicUserCompanies(userCompanyQuery);
  const { info } = usePortfolioInfo();
  const companies = useMemo(() => sortByStartDate(data?.data ?? []), [data]);

  return {
    companies,
    cvUrl: hasText(info?.cv) ? info.cv : undefined,
    isPending,
  };
}
