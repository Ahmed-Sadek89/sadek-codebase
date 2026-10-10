import { locale as rootLocale } from "next/root-params";
import { getRequestConfig } from "next-intl/server";
import { DEFAULT_LOCALE, isLocale } from "./config";

// The locale comes from the app/[locale] URL segment.
export default getRequestConfig(async ({ locale: explicitLocale }) => {
  const requested = explicitLocale ?? (await rootLocale());
  const locale = isLocale(requested) ? requested : DEFAULT_LOCALE;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
