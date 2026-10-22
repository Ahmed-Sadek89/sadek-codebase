import type { MessageKey } from "../../../../i18n/types";

export const navItems: { labelKey: MessageKey; href: string }[] = [
  { labelKey: "navHome", href: "#home" },
  { labelKey: "navAbout", href: "#about" },
  { labelKey: "navServices", href: "#services" },
  { labelKey: "navSkills", href: "#skills" },
  { labelKey: "navExperience", href: "#experience" },
  { labelKey: "navPortfolio", href: "#work" },
  { labelKey: "navContact", href: "#contact" },
];

// Each label is written in its own language, like the dashboard's switcher.
export const LANGUAGE_OPTIONS = [
  { value: "en", label: "English", flag: "/logo/en.svg" },
  { value: "ar", label: "العربية", flag: "/logo/ar.svg" },
  { value: "de", label: "Deutsch", flag: "/logo/de.svg" },
  { value: "ru", label: "Русский", flag: "/logo/ru.svg" },
] as const;
