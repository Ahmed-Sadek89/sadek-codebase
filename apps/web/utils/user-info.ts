import { cache } from "react";
import type { Metadata } from "next";
import { userInfoService } from "@repo/services/user-info";
import { userInfoQuery } from "../components/homepage/utils";
import { localize } from "./localize";

/**
 * GET /user-info/public, once per server request: generateMetadata and the
 * page's prefetch both call it, and React's cache() shares the result.
 */
export const getPublicUserInfos = cache(() =>
  userInfoService.findAllPublic(userInfoQuery),
);

/** Page metadata from the default-view user's info; `null` keeps the layout's defaults. */
export async function getUserInfoMetadata(
  locale: string,
): Promise<Metadata | null> {
  const info = await getPublicUserInfos()
    .then((response) => response.data[0])
    .catch(() => undefined);
  if (!info) return null;

  const title = localize(locale, info.headTitle_en, info.headTitle_ar);
  const description = localize(
    locale,
    info.shortDescription_en,
    info.shortDescription_ar,
  );
  const profiles = [info.github, info.linkedin].filter((url): url is string =>
    Boolean(url),
  );

  return {
    title,
    description,
    authors: profiles.map((url) => ({ url })),
    openGraph: { type: "profile", locale, title, description },
    twitter: { card: "summary", title, description },
  };
}
