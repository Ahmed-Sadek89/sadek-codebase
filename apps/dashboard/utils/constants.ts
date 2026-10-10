import { Monitor, Moon, Sun } from "@repo/ui/icons";

export const SIGNED_OUT_REDIRECT_PATH = "/";

export const THEME_OPTIONS = [
    { value: "light", labelKey: "themeLight", icon: Sun },
    { value: "dark", labelKey: "themeDark", icon: Moon },
    { value: "system", labelKey: "themeSystem", icon: Monitor },
] as const;

// Language names stay in their own language so users can always find theirs.
export const LANGUAGE_OPTIONS = [
    { value: "en", label: "English", flag: "/logo/en.svg" },
    { value: "ar", label: "العربية", flag: "/logo/ar.svg" },
    { value: "de", label: "Deutsch", flag: "/logo/de.svg" },
    { value: "ru", label: "Русский", flag: "/logo/ru.svg" },
] as const;

export const DEFAULT_THEME = "system";
