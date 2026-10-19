"use client";

import { useTranslations } from "next-intl";
import { Button } from "@repo/ui/button";
import { UserRoundPlus } from "@repo/ui/icons";

type UserInfoEmptyProps = {
  onCreate: () => void;
};

/** Shown while GET /user-info/me returns 404: the user has no row yet. */
export function UserInfoEmpty({ onCreate }: UserInfoEmptyProps) {
  const t = useTranslations();

  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed bg-card px-6 py-12 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
        <UserRoundPlus className="size-7" aria-hidden />
      </span>
      <div className="max-w-md space-y-1">
        <h2 className="text-lg font-semibold">{t("userInfoEmptyTitle")}</h2>
        <p className="text-sm text-muted-foreground">
          {t("userInfoEmptyDescription")}
        </p>
      </div>
      <Button type="button" variant="success" onClick={onCreate}>
        <UserRoundPlus className="size-4" aria-hidden />
        {t("userInfoEmptyAction")}
      </Button>
    </div>
  );
}
