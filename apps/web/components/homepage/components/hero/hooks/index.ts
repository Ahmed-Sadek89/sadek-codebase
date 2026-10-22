"use client";

import { useLocale } from "next-intl";
import type { PublicUserInfoResponse } from "@repo/types/user-info";
import { localize } from "../../../../../utils/localize";
import { hasText } from "../../../utils";
import { getHeroLinks, getInitials } from "../utils";

/** Profile, headline and social links in the page's language. */
export function useHeroContent(info: PublicUserInfoResponse | undefined) {
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
    socialLinks: info ? getHeroLinks(info) : [],
  };
}
