"use client";

import { useTranslations } from "next-intl";
import { usePublicUserInfo } from "@repo/hooks/user-info";
import { hasText } from "../../../homepage/utils";
import { getInitials } from "../../../../utils/initials";

/**
 * The site's name and logo from GET /user-info/public: the default-view
 * user's username and avatar. Shares the homepage's cached request; falls
 * back to the translated brand name when there is no user info.
 */
export function useBrand() {
  const t = useTranslations();
  const { data, isPending } = usePublicUserInfo();
  // `user` is optional-chained so an older backend without it still renders.
  const user = data?.user;
  const name = hasText(user?.username) ? user.username : t("brandName");
  return {
    name,
    initials: getInitials(name),
    logoUrl: hasText(user?.avatarUrl) ? user.avatarUrl : undefined,
    isLoading: isPending,
  };
}
