"use client";

import { useLocale } from "next-intl";
import { usePublicUserCompanies } from "@repo/hooks/user-company";
import { localize } from "../../../../utils/localize";
import { usePortfolioInfo } from "../../hooks";
import { userCompanyQuery } from "../../utils";
import { getSocialLinks } from "../utils";

/** Headline, social links and "trusted by" companies for the hero. */
export function useHeroContent() {
  const locale = useLocale();
  const { info, isPending } = usePortfolioInfo();
  // Same query as the Experience section, so this reuses its cache entry.
  const { data: companies } = usePublicUserCompanies(userCompanyQuery);

  return {
    headline: info && localize(locale, info.headTitle_en, info.headTitle_ar),
    summary:
      info &&
      localize(locale, info.shortDescription_en, info.shortDescription_ar),
    isPending,
    socialLinks: info ? getSocialLinks(info) : [],
    companyNames:
      companies?.data.map((company) =>
        localize(locale, company.name_en, company.name_ar),
      ) ?? [],
  };
}
