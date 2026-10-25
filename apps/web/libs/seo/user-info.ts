import { cache } from "react";
import type { Metadata } from "next";
import { userInfoService } from "@repo/services/user-info";
import { localize } from "../../utils/localize";
import { DEFAULT_OG_IMAGE, defaultOgImage } from "./site";

/**
 * GET /user-info/public, once per server request: generateMetadata and the
 * page's prefetch both call it, and React's cache() shares the result.
 */
export const getPublicUserInfo = cache(() => userInfoService.findPublic());

/** Page metadata from the default-view user's info; `null` keeps the layout's defaults. */
export async function getUserInfoMetadata(
  locale: string,
): Promise<Metadata | null> {
  // 404 (no default-view user) or a network error: keep the defaults.
  const info = await getPublicUserInfo().catch(() => undefined);
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
    // A page's openGraph/twitter replace the layout's, so repeat the image here.
    openGraph: {
      type: "profile",
      locale,
      title,
      description,
      images: [defaultOgImage(title)],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}
