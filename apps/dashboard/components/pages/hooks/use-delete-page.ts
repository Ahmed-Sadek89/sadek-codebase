"use client";

import { useCallback, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useDeletePage } from "@repo/hooks/pages";
import { showToast, toastApiError } from "@repo/libs/toast";
import type { Page } from "@repo/types/pages";
import { getDirection } from "../../../i18n/config";
import { localized } from "../../../utils/format";

/** Delete flow for a row: ask in a ConfirmAction, then call DELETE /pages/:id (its SEO goes too). */
export function useDeletePageAction() {
  const t = useTranslations();
  const locale = useLocale();
  const dir = getDirection(locale);
  const deletePage = useDeletePage();
  const [isOpen, setIsOpen] = useState(false);
  // Kept after closing so the question doesn't change during the close animation.
  const [page, setPage] = useState<Page | null>(null);

  const requestDelete = useCallback((target: Page) => {
    setPage(target);
    setIsOpen(true);
  }, []);

  // ConfirmAction closes the dialog once this resolves; errors are shown as a toast.
  const confirmDelete = async () => {
    if (!page) return;
    try {
      await deletePage.mutateAsync(page.id);
      showToast({ status: "success", title: t("pageDeleted"), dir });
    } catch (error) {
      toastApiError(error, { dir });
    }
  };

  const question = page
    ? t("pageDeleteQuestion", { name: localized(locale, page.name_en, page.name_ar) })
    : "";

  return {
    isOpen,
    onOpenChange: setIsOpen,
    question,
    requestDelete,
    confirmDelete,
    isDeleting: deletePage.isPending,
  };
}
