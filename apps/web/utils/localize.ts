/**
 * Backend text comes in English and Arabic only (`*_en`/`*_ar`, `nameEn`/`nameAr`).
 * Arabic pages use the Arabic value when it is set; every other locale uses English.
 */
export function localize<T extends string | null>(
  locale: string,
  en: T,
  ar: string | null | undefined,
): T | string {
  return locale === "ar" && ar?.trim() ? ar : en;
}
