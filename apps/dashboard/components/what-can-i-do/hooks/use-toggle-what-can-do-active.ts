"use client";

import { useCallback, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useToggleWhatCanDoActive } from "@repo/hooks/what-can-do";
import { showToast, toastApiError } from "@repo/libs/toast";
import type { WhatCanDoDetails } from "@repo/types/what-can-do";
import { getDirection } from "../../../i18n/config";
import { localized } from "../../../utils/format";

/**
 * Active ⇄ inactive for a row: ask in a ConfirmAction, then call
 * PATCH /what-can-do/:id/toggle-active. Inactive items are hidden from the website.
 */
export function useToggleWhatCanDoActiveAction() {
  const t = useTranslations();
  const locale = useLocale();
  const dir = getDirection(locale);
  const toggleWhatCanDoActive = useToggleWhatCanDoActive();
  const [isOpen, setIsOpen] = useState(false);
  // Kept after closing so the question doesn't change during the close animation.
  const [item, setItem] = useState<WhatCanDoDetails | null>(null);

  const requestToggle = useCallback((target: WhatCanDoDetails) => {
    setItem(target);
    setIsOpen(true);
  }, []);

  // ConfirmAction closes the dialog once this resolves; errors are shown as a toast.
  const confirmToggle = async () => {
    if (!item) return;
    try {
      const { isActive } = await toggleWhatCanDoActive.mutateAsync(item.id);
      showToast({
        status: "success",
        title: isActive ? t("whatCanDoActivated") : t("whatCanDoDeactivated"),
        dir,
      });
    } catch (error) {
      toastApiError(error, { dir });
    }
  };

  const name = item ? localized(locale, item.title_en, item.title_ar) : "";
  const question = !item
    ? ""
    : item.isActive
      ? t("whatCanDoDeactivateQuestion", { name })
      : t("whatCanDoActivateQuestion", { name });

  return {
    isOpen,
    onOpenChange: setIsOpen,
    question,
    requestToggle,
    confirmToggle,
    isToggling: toggleWhatCanDoActive.isPending,
  };
}
