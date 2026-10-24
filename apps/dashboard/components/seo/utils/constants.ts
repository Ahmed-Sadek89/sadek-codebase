import {
  DEFAULT_TWITTER_CARD,
  TWITTER_CARDS,
  TwitterCard,
} from "@repo/constants/twitter-card";
import type { PageRef } from "@repo/types/pages";
import type { Seo, SeoListQuery } from "@repo/types/seo";
import type { MessageKey } from "../../../i18n/types";
import {
  readListQueryParams,
  readPositiveInt,
  type ParamReader,
} from "../../../utils/list-query";
import { SEO_PAGE_ID_PARAM } from "../../../utils/constants";
import { localized } from "../../../utils/format";
import type { SeoFormInput } from "../schema";

/** Each share card size's label; a `Record`, so a new size needs one. */
const TWITTER_CARD_LABEL_KEYS: Record<TwitterCard, MessageKey> = {
  [TwitterCard.SUMMARY]: "seoTwitterCardSummary",
  [TwitterCard.SUMMARY_LARGE_IMAGE]: "seoTwitterCardLarge",
};

/** Options for the card-size select, in the shared order. */
export const TWITTER_CARD_OPTIONS = TWITTER_CARDS.map((value) => ({
  value,
  labelKey: TWITTER_CARD_LABEL_KEYS[value],
}));

/** The label key of a share card size. */
export function twitterCardLabelKey(card: TwitterCard): MessageKey {
  return TWITTER_CARD_LABEL_KEYS[card];
}

/** A page's name in the active locale (Arabic pages fall back to English). */
export function pageLabel(
  locale: string,
  page: Pick<PageRef, "name_en" | "name_ar">,
): string {
  return localized(locale, page.name_en, page.name_ar);
}

/**
 * Pages the page filter and select offer: up to the backend's page-size cap
 * (PAGINATION.MAX_LIMIT, 30), enough for every website page.
 */
export const SEO_PAGE_OPTIONS_QUERY = { limit: 30 } as const;

/** Page size when the URL has no `?limit=`. */
export const SEO_LIST_LIMIT = 10;

/**
 * The list query for the URL's `search`, `page`, `limit`, `order`,
 * `isActive`, and `pageId` (any combination). Shared by the server prefetch
 * and the client hook so both build the same query key. `pageId` is read
 * here, not in readListQueryParams, because only GET /seo accepts it.
 */
export function getSeoListQuery(get: ParamReader): SeoListQuery {
  const pageId = readPositiveInt(get(SEO_PAGE_ID_PARAM));
  return {
    limit: SEO_LIST_LIMIT,
    ...readListQueryParams(get),
    ...(pageId !== undefined && { pageId }),
  };
}

export const SEO_FORM_DEFAULT_VALUES = {
  // A Select value; the schema turns it into a number.
  pageId: "",
  metaTitle_en: "",
  metaTitle_ar: "",
  metaDescription_en: "",
  metaDescription_ar: "",
  canonicalUrl: "",
  hreflang: [],
  keywords_en: "",
  keywords_ar: "",
  ogTitle_en: "",
  ogTitle_ar: "",
  ogDescription_en: "",
  ogDescription_ar: "",
  ogImage: "",
  ogImageAlt_en: "",
  ogImageAlt_ar: "",
  twitterCard: DEFAULT_TWITTER_CARD,
  twitterHandle: "",
  jobTitle_en: "",
  jobTitle_ar: "",
  robotsIndex: true,
  robotsFollow: true,
} satisfies SeoFormInput;

/** Form values for a row being edited, or the blank defaults when creating. */
export function toSeoFormInput(
  seo?: Seo | null,
): SeoFormInput {
  if (!seo) return SEO_FORM_DEFAULT_VALUES;
  return {
    pageId: String(seo.pageId),
    metaTitle_en: seo.metaTitle_en,
    metaTitle_ar: seo.metaTitle_ar,
    metaDescription_en: seo.metaDescription_en,
    metaDescription_ar: seo.metaDescription_ar,
    canonicalUrl: seo.canonicalUrl ?? "",
    hreflang: seo.hreflang.map(({ lang, url }) => ({ lang, url })),
    keywords_en: seo.keywords_en ?? "",
    keywords_ar: seo.keywords_ar ?? "",
    ogTitle_en: seo.ogTitle_en ?? "",
    ogTitle_ar: seo.ogTitle_ar ?? "",
    ogDescription_en: seo.ogDescription_en ?? "",
    ogDescription_ar: seo.ogDescription_ar ?? "",
    ogImage: seo.ogImage ?? "",
    ogImageAlt_en: seo.ogImageAlt_en ?? "",
    ogImageAlt_ar: seo.ogImageAlt_ar ?? "",
    twitterCard: seo.twitterCard,
    twitterHandle: seo.twitterHandle ?? "",
    jobTitle_en: seo.jobTitle_en ?? "",
    jobTitle_ar: seo.jobTitle_ar ?? "",
    robotsIndex: seo.robotsIndex,
    robotsFollow: seo.robotsFollow,
  };
}

/** Optional text fields that PATCH clears with `null` when emptied. */
export const SEO_CLEARABLE_FIELDS = [
  "canonicalUrl",
  "keywords_en",
  "keywords_ar",
  "ogTitle_en",
  "ogTitle_ar",
  "ogDescription_en",
  "ogDescription_ar",
  "ogImageAlt_en",
  "ogImageAlt_ar",
  "twitterHandle",
  "jobTitle_en",
  "jobTitle_ar",
] as const satisfies readonly (keyof Seo)[];

export const PREVIEW_LANGUAGES = ["en", "ar"] as const;
export type PreviewLanguage = (typeof PREVIEW_LANGUAGES)[number];

/**
 * The texts a search engine and a shared link would show in one language:
 * empty optional Arabic texts fall back to English, and empty share texts fall
 * back to the meta title and description (as the website will do).
 */
export function getPreviewTexts(seo: Seo, language: PreviewLanguage) {
  const pick = (en: string | null, ar: string | null) =>
    (language === "ar" ? ar?.trim() || en : en)?.trim() || null;
  const metaTitle = language === "ar" ? seo.metaTitle_ar : seo.metaTitle_en;
  const metaDescription =
    language === "ar" ? seo.metaDescription_ar : seo.metaDescription_en;
  return {
    metaTitle,
    metaDescription,
    ogTitle: pick(seo.ogTitle_en, seo.ogTitle_ar) ?? metaTitle,
    ogDescription: pick(seo.ogDescription_en, seo.ogDescription_ar) ?? metaDescription,
    ogImageAlt: pick(seo.ogImageAlt_en, seo.ogImageAlt_ar),
  };
}

/** `index, follow`-style robots text (the same words in every language) and its badge tone. */
export function getRobotsBadge(seo: Pick<Seo, "robotsIndex" | "robotsFollow">) {
  return {
    value: `${seo.robotsIndex ? "index" : "noindex"}, ${seo.robotsFollow ? "follow" : "nofollow"}`,
    tone: seo.robotsIndex && seo.robotsFollow ? ("primary" as const) : ("warning" as const),
  };
}

/** The host shown as the result's site line, e.g. "example.com" from the canonical URL. */
export function getPreviewSite(seo: Pick<Seo, "canonicalUrl">): string | null {
  if (!seo.canonicalUrl) return null;
  try {
    const url = new URL(seo.canonicalUrl);
    return `${url.host}${url.pathname === "/" ? "" : url.pathname}`;
  } catch {
    return null;
  }
}

/** Language codes offered as one-click alternates in the form. */
export const HREFLANG_SUGGESTIONS = ["en", "ar", "x-default"] as const;
