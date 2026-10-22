"use client";

import { useTranslations } from "next-intl";

export function ProfileHeader() {
  const t = useTranslations();

  return (
    <header className="min-w-0 space-y-1">
      <h1 className="text-2xl font-semibold tracking-tight">
        {t("profileTitle")}
      </h1>
      <p className="text-sm text-muted-foreground">{t("profileDescription")}</p>
    </header>
  );
}
