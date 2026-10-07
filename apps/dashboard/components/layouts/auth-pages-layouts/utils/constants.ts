import { Monitor, Moon, Sun } from "@repo/ui/icons";

export const THEME_OPTIONS = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const;

export const LANGUAGE_OPTIONS = [
  { value: "en", label: "English" },
  { value: "ar", label: "العربية" },
  { value: "de", label: "Deutsch" },
  { value: "ru", label: "Русский" },
] as const;

export const DEFAULT_THEME = "system";
export const DEFAULT_LANGUAGE = "en";
