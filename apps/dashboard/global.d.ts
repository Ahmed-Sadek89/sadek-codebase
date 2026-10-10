import type messages from "./messages/en.json";
import type { AppLocale } from "./i18n/config";

// Types useTranslations()/getTranslations() keys against the flat English catalog.
declare module "next-intl" {
  interface AppConfig {
    Locale: AppLocale;
    Messages: typeof messages;
  }
}
