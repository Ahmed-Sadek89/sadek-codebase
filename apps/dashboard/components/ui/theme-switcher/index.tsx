"use client";

import { useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";
import { useTheme } from "@repo/provider/theme-provider";
import { DEFAULT_THEME, THEME_OPTIONS } from "../../../utils/constants";

const subscribe = () => () => { };

export function ThemeSelect() {
  const t = useTranslations();
  const { theme, setTheme } = useTheme();
  // The stored theme is only known in the browser; render the default until mounted.
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  return (
    <Select
      value={mounted ? (theme ?? DEFAULT_THEME) : DEFAULT_THEME}
      onValueChange={setTheme}
      disabled={!mounted}
    >
      <SelectTrigger aria-label={t("themeSelectLabel")} className="sm:w-32 border-0">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {THEME_OPTIONS.map(({ value, labelKey, icon: Icon }) => (
          <SelectItem key={value} value={value}>
            <Icon className="text-muted-foreground" />
            <span className="hidden sm:block">{t(labelKey)}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
