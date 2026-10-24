"use client";

import { useCallback, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useToggleSeoActive } from "@repo/hooks/seo";
import { showToast, toastApiError } from "@repo/libs/toast";
import type { Seo } from "@repo/types/seo";
import { getDirection } from "../../../i18n/config";
import { localized } from "../../../utils/format";

/**
 * Live ⇄ offline for a row: ask in a ConfirmAction, then call
 * PATCH /seo/:id/toggle-active. Going live takes the page's other live row offline.
 */
export function useToggleSeoActiveAction() {
  const t = useTranslations();
  const locale = useLocale();
  const dir = getDirection(locale);
  const toggleSeoActive = useToggleSeoActive();
  const [isOpen, setIsOpen] = useState(false);
  // Kept after closing so the question doesn't change during the close animation.
  const [seo, setSeo] = useState<Seo | null>(null);

  const requestToggle = useCallback((target: Seo) => {
    setSeo(target);
    setIsOpen(true);
  }, []);

  // ConfirmAction closes the dialog once this resolves; errors are shown as a toast.
  const confirmToggle = async () => {
    if (!seo) return;
    try {
      const { isActive } = await toggleSeoActive.mutateAsync(seo.id);
      showToast({
        status: "success",
        title: isActive ? t("seoActivated") : t("seoDeactivated"),
        dir,
      });
    } catch (error) {
      toastApiError(error, { dir });
    }
  };

  const name = seo ? localized(locale, seo.metaTitle_en, seo.metaTitle_ar) : "";
  const question = !seo
    ? ""
    : seo.isActive
      ? t("seoDeactivateQuestion", { name })
      : t("seoActivateQuestion", { name });

  return {
    isOpen,
    onOpenChange: setIsOpen,
    question,
    requestToggle,
    confirmToggle,
    isToggling: toggleSeoActive.isPending,
  };
}
