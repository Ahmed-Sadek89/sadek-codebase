import { locale as rootLocale } from "next/root-params";
import { getRequestConfig } from "next-intl/server";
import { DEFAULT_LOCALE, isLocale } from "./config";

// The locale comes from the app/[locale] URL segment.
export default getRequestConfig(async ({ locale: explicitLocale }) => {
  const requested = explicitLocale ?? (await rootLocale());
  const locale = isLocale(requested) ? requested : DEFAULT_LOCALE;

  return {
    locale,
    // One fixed zone so dates format identically on the server and in the browser.
    timeZone: "UTC",
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
