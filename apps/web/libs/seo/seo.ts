import { cache } from "react";
import type { Metadata } from "next";
import { seoService } from "@repo/services/seo";
import type { SeoDetails } from "@repo/types/seo";
import { localize } from "../../utils/localize";
import {
  defaultLanguageAlternates,
  defaultOgImage,
  localeUrl,
  uploadedIcons,
} from "./site";

/**
 * The homepage's name in the dashboard's Pages, per language: the backend
 * matches it against the page's `name_ar` or `name_en` (case-insensitive).
 */
const HOME_PAGE_NAME = { ar: "الرئيسية", en: "homepage" } as const;

/** The homepage's page name to look up in this locale (Arabic on /ar, English elsewhere). */
export function homePageName(locale: string): string {
  return locale === "ar" ? HOME_PAGE_NAME.ar : HOME_PAGE_NAME.en;
}

/**
 * GET /seo/public/:pageName for the homepage in this locale, once per server
 * request and locale (shared by generateMetadata and the JSON-LD). `null`
 * when no page has that name, it has no active row, or the backend can't be
 * reached, so the page keeps its default metadata.
 */
export const getHomeSeo = cache(
  async (locale: string): Promise<SeoDetails | null> =>
    seoService.findPublic(homePageName(locale)).catch(() => null),
);

/** "a, b , c" → ["a", "b", "c"]. */
function splitKeywords(value: string | null): string[] | undefined {
  const keywords = value
    ?.split(",")
    .map((keyword) => keyword.trim())
    .filter(Boolean);
  return keywords?.length ? keywords : undefined;
}

/**
 * Language alternates from the row's hreflang list, or every locale's
 * homepage when the list is empty.
 */
function languageAlternates(seo: SeoDetails): Record<string, string> {
  if (!seo.hreflang.length) return defaultLanguageAlternates();
  return Object.fromEntries(seo.hreflang.map(({ lang, url }) => [lang, url]));
}

/**
 * Each language page is its own canonical (pointing /ar at /en would drop
 * the Arabic page from search): the hreflang URL for this locale, else the
 * row's `canonicalUrl` when it is this locale's page, else /{locale}.
 */
function canonicalFor(seo: SeoDetails, locale: string): string {
  const own = seo.hreflang.find((entry) => entry.lang === locale)?.url;
  if (own) return own;
  const fallback = localeUrl(locale);
  const canonical = seo.canonicalUrl?.replace(/\/+$/, "");
  return canonical && canonical.endsWith(`/${locale}`) ? canonical : fallback;
}

/** Open Graph locale codes for the site's languages. */
const OG_LOCALES: Record<string, string> = {
  en: "en_US",
  ar: "ar_EG",
  de: "de_DE",
  ru: "ru_RU",
};

/**
 * Next.js metadata from the homepage's SEO row, in the page's language
 * (Arabic texts on /ar when set, English elsewhere, like the rest of the
 * site). Open Graph and Twitter texts fall back to the meta title and
 * description, and the image to the default share image (public/og).
 */
export function seoToMetadata(seo: SeoDetails, locale: string): Metadata {
  const title = localize(locale, seo.metaTitle_en, seo.metaTitle_ar);
  const description = localize(locale, seo.metaDescription_en, seo.metaDescription_ar);
  const ogTitle = localize(locale, seo.ogTitle_en, seo.ogTitle_ar) || title;
  const ogDescription =
    localize(locale, seo.ogDescription_en, seo.ogDescription_ar) || description;
  const imageAlt = localize(locale, seo.ogImageAlt_en, seo.ogImageAlt_ar) || ogTitle;
  // An image uploaded in the dashboard can be any size, so only the default
  // image announces its dimensions and type.
  const image = seo.ogImage ? { url: seo.ogImage, alt: imageAlt } : defaultOgImage(imageAlt);
  const canonical = canonicalFor(seo, locale);
  const handle = seo.twitterHandle
    ? `@${seo.twitterHandle.replace(/^@/, "")}`
    : undefined;

  return {
    title,
    description,
    // The tab icon set in the dashboard; without one the layout's default stays.
    ...(seo.favicon && { icons: uploadedIcons(seo.favicon) }),
    keywords: splitKeywords(localize(locale, seo.keywords_en, seo.keywords_ar)),
    alternates: { canonical, languages: languageAlternates(seo) },
    openGraph: {
      type: "website",
      url: canonical,
      title: ogTitle,
      description: ogDescription,
      locale: OG_LOCALES[locale] ?? locale,
      alternateLocale: Object.entries(OG_LOCALES)
        .filter(([code]) => code !== locale)
        .map(([, ogLocale]) => ogLocale),
      images: [image],
    },
    twitter: {
      card: seo.twitterCard,
      site: handle,
      creator: handle,
      title: ogTitle,
      description: ogDescription,
      images: [{ url: image.url, alt: image.alt }],
    },
    robots: {
      index: seo.robotsIndex,
      follow: seo.robotsFollow,
      googleBot: {
        index: seo.robotsIndex,
        follow: seo.robotsFollow,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}
