/**
 * Rules for an SEO row's `hreflang` alternates (`<link rel="alternate"
 * hreflang="…" href="…">`), shared by the backend DTO and the dashboard form.
 */

/** The fallback alternate for visitors whose language has no page of its own. */
export const X_DEFAULT_HREFLANG = "x-default";

/** A language (`en`), language-region (`en-GB`, `ar-EG`), or `x-default`. */
export const HREFLANG_PATTERN = /^(?:x-default|[a-z]{2,3}(?:-[A-Za-z0-9]{2,8})?)$/;

/** Alternates one row may hold. */
export const HREFLANG_MAX = 10;

/** Max length of an alternate's language code and URL (matches the URL columns). */
export const HREFLANG_LANG_MAX = 20;
export const SEO_URL_MAX = 255;

/** One alternate: the page's URL for one language. */
export type SeoHreflang = {
  lang: string;
  url: string;
};
