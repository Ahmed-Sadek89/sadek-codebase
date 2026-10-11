/**
 * Picks the value for the active locale from an English/Arabic pair, falling
 * back to the other language. Locales other than Arabic use the English value.
 */
export function localized(
  locale: string,
  en: string | null | undefined,
  ar: string | null | undefined,
): string {
  const preferred = locale === "ar" ? ar : en;
  const fallback = locale === "ar" ? en : ar;
  return preferred?.trim() || fallback?.trim() || "";
}
