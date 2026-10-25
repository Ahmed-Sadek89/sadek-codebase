"use client";

import { useCallback, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useDeleteSeo } from "@repo/hooks/seo";
import { showToast, toastApiError } from "@repo/libs/toast";
import type { Seo } from "@repo/types/seo";
import { getDirection } from "../../../i18n/config";
import { deleteFile } from "../../../libs/upload/delete-file";
import { localized } from "../../../utils/format";

/** Delete flow for a row: ask in a ConfirmAction, then call DELETE /seo/:id. */
export function useDeleteSeoAction() {
  const t = useTranslations();
  const locale = useLocale();
  const dir = getDirection(locale);
  const deleteSeo = useDeleteSeo();
  const [isOpen, setIsOpen] = useState(false);
  // Kept after closing so the question doesn't change during the close animation.
  const [seo, setSeo] = useState<Seo | null>(null);

  const requestDelete = useCallback((target: Seo) => {
    setSeo(target);
    setIsOpen(true);
  }, []);

  // ConfirmAction closes the dialog once this resolves; errors are shown as a toast.
  const confirmDelete = async () => {
    if (!seo) return;
    try {
      // 1. The share image and tab icon first (only our own uploads; never
      // throws), 2. the row.
      await Promise.all([deleteFile(seo.ogImage), deleteFile(seo.favicon)]);
      await deleteSeo.mutateAsync(seo.id);
      showToast({ status: "success", title: t("seoDeleted"), dir });
    } catch (error) {
      toastApiError(error, { dir });
    }
  };

  const question = seo
    ? t("seoDeleteQuestion", {
        name: localized(locale, seo.metaTitle_en, seo.metaTitle_ar),
      })
    : "";

  return {
    isOpen,
    onOpenChange: setIsOpen,
    question,
    requestDelete,
    confirmDelete,
    isDeleting: deleteSeo.isPending,
  };
}
