"use client";

import { useTranslations } from "next-intl";
import { Button } from "@repo/ui/button";
import { CircleAlert, RotateCw } from "@repo/ui/icons";
import { cn } from "@repo/ui/utils";

type UserInfoErrorProps = {
  onRetry: () => void;
  isRetrying?: boolean;
};

export function UserInfoError({
  onRetry,
  isRetrying = false,
}: UserInfoErrorProps) {
  const t = useTranslations();

  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-3 rounded-xl border border-danger/30 bg-danger/5 px-6 py-10 text-center"
    >
      <CircleAlert className="size-8 text-danger" aria-hidden />
      <p className="text-danger">{t("userInfoError")}</p>
      <Button
        type="button"
        variant="outline"
        onClick={onRetry}
        disabled={isRetrying}
      >
        <RotateCw
          className={cn("size-4", isRetrying && "animate-spin")}
          aria-hidden
        />
        {t("tableRetry")}
      </Button>
    </div>
  );
}
