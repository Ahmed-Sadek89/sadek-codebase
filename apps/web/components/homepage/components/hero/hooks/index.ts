"use client";

import { useLocale } from "next-intl";
import type { UserCompany } from "@repo/types/user-company";
import type { PublicUserInfoResponse } from "@repo/types/user-info";
import { localize } from "../../../../../utils/localize";
import { hasText } from "../../../utils";
import { getInitials, getSocialLinks } from "../utils";

/** Profile, headline, social links and "trusted by" names in the page's language. */
export function useHeroContent(
  info: PublicUserInfoResponse | undefined,
  companies: UserCompany[],
) {
  const locale = useLocale();
  const user = info?.user;
  return {
    profile: user && {
      name: user.username,
      initials: getInitials(user.username),
      avatarUrl: hasText(user.avatarUrl) ? user.avatarUrl : undefined,
      coverPhotoUrl: hasText(user.coverPhotoUrl)
        ? user.coverPhotoUrl
        : undefined,
    },
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
