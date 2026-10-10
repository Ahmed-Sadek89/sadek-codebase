export const LOCALES = ["en", "ar", "de", "ru"] as const;

export type AppLocale = (typeof LOCALES)[number];

// Always English until the user picks a language; the browser language is ignored.
export const DEFAULT_LOCALE: AppLocale = "en";

export const LOCALE_COOKIE_NAME = "NEXT_LOCALE";

const RTL_LOCALES: readonly AppLocale[] = ["ar"];

export function isLocale(value: unknown): value is AppLocale {
  return LOCALES.includes(value as AppLocale);
}

export function getDirection(locale: string): "ltr" | "rtl" {
  return RTL_LOCALES.includes(locale as AppLocale) ? "rtl" : "ltr";
}
