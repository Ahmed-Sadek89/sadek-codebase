export const LOCALES = ["en", "ar", "de", "ru"] as const;

export type AppLocale = (typeof LOCALES)[number];

// Used when the device language is none of LOCALES.
export const DEFAULT_LOCALE: AppLocale = "en";

const RTL_LOCALES: readonly AppLocale[] = ["ar"];

export function isLocale(value: unknown): value is AppLocale {
  return LOCALES.includes(value as AppLocale);
}

export function getDirection(locale: string): "ltr" | "rtl" {
  return RTL_LOCALES.includes(locale as AppLocale) ? "rtl" : "ltr";
}
