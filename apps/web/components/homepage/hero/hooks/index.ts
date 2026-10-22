"use client";

import { usePublicUserCompanies } from "@repo/hooks/user-company";
import { usePortfolioInfo } from "../../hooks";
import { userCompanyQuery } from "../../utils";
import { getSocialLinks } from "../utils";

/** Headline, social links and "trusted by" companies for the hero. */
export function useHeroContent() {
  const { info, isPending } = usePortfolioInfo();
  // Same query as the Experience section, so this reuses its cache entry.
  const { data: companies } = usePublicUserCompanies(userCompanyQuery);

  return {
    info,
    isPending,
    socialLinks: info ? getSocialLinks(info) : [],
    companyNames: companies?.data.map((company) => company.name_en) ?? [],
  };
}
