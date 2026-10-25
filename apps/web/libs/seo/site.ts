import { LOCALES } from "../../i18n/config";
import { pwaIconUrl } from "../pwa/icons";

/**
 * The website's public origin, e.g. "https://sadek.dev", from `SITE_URL`
 * (no trailing slash). Absolute URLs in metadata, robots.txt and the sitemap
 * are built from it; falls back to the local dev server.
 */
export function getSiteUrl(): string {
  const url = process.env.SITE_URL?.trim();
  if (!url) {
    warnMissingSiteUrl();
    return "http://localhost:3000";
  }
  return url.replace(/\/+$/, "");
}

let warned = false;
/** Social sites can't fetch localhost images, so say so once in production builds. */
function warnMissingSiteUrl() {
  if (warned || process.env.NODE_ENV !== "production") return;
  warned = true;
  console.warn(
    "[seo] SITE_URL is not set: canonical URLs, og:image and twitter:image point to http://localhost:3000, so link previews will have no image. Set SITE_URL to the site's public origin.",
  );
}

/** The homepage URL for one locale: every page URL starts with its locale. */
export function localeUrl(locale: string): string {
  return `${getSiteUrl()}/${locale}`;
}

/** The homepage in every locale, plus `x-default` (English). */
export function defaultLanguageAlternates(): Record<string, string> {
  return {
    ...Object.fromEntries(LOCALES.map((locale) => [locale, localeUrl(locale)])),
    "x-default": localeUrl("en"),
  };
}

/** Fallback share image (1200×630) in public/og, used when no SEO row sets one. */
export const DEFAULT_OG_IMAGE = "/og/home-1200x630.png";

/**
 * DEFAULT_OG_IMAGE as an Open Graph image: its real size and type, which let
 * Facebook / LinkedIn / WhatsApp show the large preview on the first share.
 */
export function defaultOgImage(alt?: string) {
  return {
    url: DEFAULT_OG_IMAGE,
    width: 1200,
    height: 630,
    type: "image/png",
    ...(alt && { alt }),
  };
}

/**
 * The site's default tab and home-screen icons (public/). Declared as
 * metadata rather than app/icon.png file conventions, because file-based icons
 * always win over metadata and would hide a tab icon set in the dashboard.
 */
export const DEFAULT_ICONS = {
  icon: [
    { url: "/favicon.ico", sizes: "48x48", type: "image/x-icon" },
    { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
  ],
  apple: [{ url: "/icons/apple-icon-180.png", sizes: "180x180", type: "image/png" }],
};

/**
 * Icons for an uploaded tab icon (a 512×512 transparent PNG from the
 * dashboard). The Apple touch icon is drawn from it on a solid background
 * (app/icons/pwa), because iOS fills transparency with black.
 */
export function uploadedIcons(url: string) {
  return {
    icon: [{ url, sizes: "512x512", type: "image/png" }],
    shortcut: [{ url, type: "image/png" }],
    apple: [{ url: pwaIconUrl("apple-180.png", url), sizes: "180x180", type: "image/png" }],
  };
}
