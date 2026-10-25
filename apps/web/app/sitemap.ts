import type { MetadataRoute } from "next";
import { LOCALES } from "../i18n/config";
import { defaultLanguageAlternates, localeUrl } from "../libs/seo/site";

/**
 * /sitemap.xml: the homepage in every language, each listing the others as
 * hreflang alternates (the site is a single page per locale).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const languages = defaultLanguageAlternates();
  return LOCALES.map((locale) => ({
    url: localeUrl(locale),
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: locale === "en" ? 1 : 0.8,
    alternates: { languages },
  }));
}
