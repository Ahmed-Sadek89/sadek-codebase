"use client";

import { useLocale } from "next-intl";
import type { UserCompany } from "@repo/types/user-company";
import type { UserInfoDetails } from "@repo/types/user-info";
import { localize } from "../../../../../utils/localize";
import { getSocialLinks } from "../utils";

/** Headline, social links and "trusted by" names in the page's language. */
export function useHeroContent(
  info: UserInfoDetails | undefined,
  companies: UserCompany[],
) {
  const locale = useLocale();
  return {
    headline: info && localize(locale, info.headTitle_en, info.headTitle_ar),
    summary:
      info &&
      localize(locale, info.shortDescription_en, info.shortDescription_ar),
    socialLinks: info ? getSocialLinks(info) : [],
    companyNames: companies.map((company) =>
      localize(locale, company.name_en, company.name_ar),
    ),
  };
}
