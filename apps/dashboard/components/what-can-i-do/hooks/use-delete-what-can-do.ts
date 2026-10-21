"use client";

import { useCallback, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useDeleteWhatCanDo } from "@repo/hooks/what-can-do";
import { showToast, toastApiError } from "@repo/libs/toast";
import type { WhatCanDoDetails } from "@repo/types/what-can-do";
import { getDirection } from "../../../i18n/config";
import { localized } from "../../../utils/format";

/** Delete flow for a row: ask in a ConfirmAction, then call DELETE /what-can-do/:id. */
export function useDeleteWhatCanDoAction() {
  const t = useTranslations();
  const locale = useLocale();
  const dir = getDirection(locale);
  const deleteWhatCanDo = useDeleteWhatCanDo();
  const [isOpen, setIsOpen] = useState(false);
  // Kept after closing so the question doesn't change during the close animation.
  const [item, setItem] = useState<WhatCanDoDetails | null>(null);

  const requestDelete = useCallback((target: WhatCanDoDetails) => {
    setItem(target);
    setIsOpen(true);
  }, []);

  // ConfirmAction closes the dialog once this resolves; errors are shown as a toast.
  const confirmDelete = async () => {
    if (!item) return;
    try {
      await deleteWhatCanDo.mutateAsync(item.id);
      showToast({ status: "success", title: t("whatCanDoDeleted"), dir });
    } catch (error) {
      toastApiError(error, { dir });
    }
  };

  const question = item
    ? t("whatCanDoDeleteQuestion", {
        name: localized(locale, item.title_en, item.title_ar),
      })
    : "";

  return {
    isOpen,
    onOpenChange: setIsOpen,
    question,
    requestDelete,
    confirmDelete,
    isDeleting: deleteWhatCanDo.isPending,
  };
}
