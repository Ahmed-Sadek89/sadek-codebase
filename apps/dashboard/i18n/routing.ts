import { defineRouting } from "next-intl/routing";
import { DEFAULT_LOCALE, LOCALES } from "./config";

// Every page URL starts with its locale: /en/dashboard, /ar/dashboard, ...
// proxy.ts adds the prefix; the browser language is never consulted.
export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: "always",
  localeDetection: false,
  localeCookie: false,
});
