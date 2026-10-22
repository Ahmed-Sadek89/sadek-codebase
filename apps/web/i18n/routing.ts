import { defineRouting } from "next-intl/routing";
import { DEFAULT_LOCALE, LOCALES } from "./config";

// Every page URL starts with its locale: /en, /ar, ... An unprefixed URL goes
// to the language picked earlier (NEXT_LOCALE cookie), else the device
// language (Accept-Language), else English. proxy.ts applies this.
export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: "always",
  localeDetection: true,
});
