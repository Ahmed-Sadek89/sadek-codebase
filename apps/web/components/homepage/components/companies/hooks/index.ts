"use client";

import { useMemo } from "react";
import { useLocale } from "next-intl";
import type { UserCompany } from "@repo/types/user-company";
import { toCompanyBadge } from "../utils";

export function useCompanyBadges(companies: UserCompany[]) {
  const locale = useLocale();
  return useMemo(
    () => companies.map((company) => toCompanyBadge(company, locale)),
    [companies, locale],
  );
}
