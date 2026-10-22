"use client";

import { useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { Moon, Sun } from "@repo/ui/icons";
import { Switch } from "@repo/ui/switch";
import { useTheme } from "@repo/provider/theme-provider";

const subscribe = () => () => {};

export function ThemeToggle() {
  const t = useTranslations();
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  return (
    <div className="flex shrink-0 items-center gap-2 text-muted-foreground">
      <Sun className="size-4" aria-hidden="true" />
      <Switch
        aria-label={t("themeDarkMode")}
        checked={mounted && resolvedTheme === "dark"}
        disabled={!mounted}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
      />
      <Moon className="size-4" aria-hidden="true" />
    </div>
  );
}
