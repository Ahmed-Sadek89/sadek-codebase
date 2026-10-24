import {
  isSeoPageName,
  SEO_PAGE_NAMES,
  SeoPageName,
} from "@repo/constants/seo-pages";
import {
  DEFAULT_TWITTER_CARD,
  TWITTER_CARDS,
  TwitterCard,
} from "@repo/constants/twitter-card";
import type { Seo, SeoListQuery } from "@repo/types/seo";
import type { MessageKey } from "../../../i18n/types";
import {
  readListQueryParams,
  type ParamReader,
} from "../../../utils/list-query";
import { SEO_PAGE_NAME_PARAM } from "../../../utils/constants";
import type { SeoFormInput } from "../schema";

/**
 * Each website page's label. A `Record`, so adding a page to the shared
 * `SeoPageName` (`@repo/constants/seo-pages`) fails type-checking until it
 * has a label here (and in the four message files).
 */
const SEO_PAGE_LABEL_KEYS: Record<SeoPageName, MessageKey> = {
  [SeoPageName.HOME]: "seoPageHome",
};

/** Options for the page select and filter chips, in the shared order. */
export const SEO_PAGES = SEO_PAGE_NAMES.map((value) => ({
  value,
  labelKey: SEO_PAGE_LABEL_KEYS[value],
}));

/** The label key of a page, for tables, filters and selects. */
export function seoPageLabelKey(pageName: SeoPageName): MessageKey {
  return SEO_PAGE_LABEL_KEYS[pageName];
}

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

/** A `?pageName=` value, or undefined when missing or unknown. */
export function readSeoPageName(
  raw: string | null | undefined,
): SeoPageName | undefined {
  return isSeoPageName(raw) ? raw : undefined;
}

/** Page size when the URL has no `?limit=`. */
export const SEO_LIST_LIMIT = 10;

/**
 * The list query for the URL's `search`, `page`, `limit`, `order`,
 * `isActive`, and `pageName` (any combination). Shared by the server prefetch
 * and the client hook so both build the same query key. `pageName` is read
 * here, not in readListQueryParams, because only GET /seo accepts it.
 */
export function getSeoListQuery(get: ParamReader): SeoListQuery {
  const pageName = readSeoPageName(get(SEO_PAGE_NAME_PARAM));
  return {
    limit: SEO_LIST_LIMIT,
    ...readListQueryParams(get),
    ...(pageName && { pageName }),
  };
}

export const SEO_FORM_DEFAULT_VALUES = {
  pageName: SEO_PAGE_NAMES[0],
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
    pageName: seo.pageName,
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
