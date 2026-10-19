"use client";

import { useTranslations } from "next-intl";
import { Button } from "@repo/ui/button";
import { Pencil } from "@repo/ui/icons";

type UserInfoHeaderProps = {
  /** Shows the Edit button; omitted while editing, loading, or empty. */
  onEdit?: () => void;
};

export function UserInfoHeader({ onEdit }: UserInfoHeaderProps) {
  const t = useTranslations();

  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          {t("userInfoTitle")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t("userInfoDescription")}
        </p>
      </div>
      {onEdit && (
        <Button type="button" onClick={onEdit} className="shrink-0 self-end">
          <Pencil className="size-4" aria-hidden />
          {t("userInfoEdit")}
        </Button>
      )}
    </header>
  );
}
