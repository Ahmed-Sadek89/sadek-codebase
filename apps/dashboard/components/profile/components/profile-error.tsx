"use client";

import { useTranslations } from "next-intl";
import { Button } from "@repo/ui/button";
import { CircleAlert, RotateCw } from "@repo/ui/icons";
import { cn } from "@repo/ui/utils";

type ProfileErrorProps = {
  onRetry: () => void;
  isRetrying?: boolean;
};

export function ProfileError({ onRetry, isRetrying = false }: ProfileErrorProps) {
  const t = useTranslations();

  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-3 rounded-xl border border-danger bg-card px-6 py-10 text-center"
    >
      <CircleAlert className="size-8 text-danger" aria-hidden />
      <p className="text-danger">{t("profileError")}</p>
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
