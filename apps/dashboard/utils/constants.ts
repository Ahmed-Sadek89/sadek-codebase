export const SIGNED_OUT_REDIRECT_PATH = "/";
import { Monitor, Moon, Sun } from "@repo/ui/icons";

export const THEME_OPTIONS = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
] as const;

export const LANGUAGE_OPTIONS = [
    { value: "en", label: "English", flag: "/logo/en.svg" },
    { value: "ar", label: "العربية", flag: "/logo/ar.svg" },
    { value: "de", label: "Deutsch", flag: "/logo/de.svg" },
    { value: "ru", label: "Русский", flag: "/logo/ru.svg" },
] as const;

export const DEFAULT_THEME = "system";
export const DEFAULT_LANGUAGE = "en";
