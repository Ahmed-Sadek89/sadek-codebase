"use client";

import { useMemo } from "react";
import { usePublicUserInfo } from "@repo/hooks/user-info";
import { getProfileLinks } from "../../../homepage/utils";

/**
 * The owner's links (CV, email, LinkedIn, GitHub) from GET /user-info/public,
 * already prefetched by the (home) layout, so no extra request.
 */
export function useFooterLinks() {
  const { data: info } = usePublicUserInfo();
  return useMemo(
    // `user` is optional-chained so an older backend without it still renders.
    () => (info ? getProfileLinks(info, info.user?.email) : []),
    [info],
  );
}
