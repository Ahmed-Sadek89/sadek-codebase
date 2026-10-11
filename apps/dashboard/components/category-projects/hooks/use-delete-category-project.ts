"use client";

import { useCallback, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useDeleteCategoryProject } from "@repo/hooks/category-projects";
import { showToast, toastApiError } from "@repo/libs/toast";
import type { CategoryProject } from "@repo/types/category-projects";
import { getDirection } from "../../../i18n/config";
import { localized } from "../../../utils/format";

/** Delete flow for a row: ask in a ConfirmAction, then call DELETE /category-projects/:id. */
export function useDeleteCategoryProjectAction() {
  const t = useTranslations();
  const locale = useLocale();
  const dir = getDirection(locale);
  const deleteCategoryProject = useDeleteCategoryProject();
  const [isOpen, setIsOpen] = useState(false);
  // Kept after closing so the question doesn't change during the close animation.
  const [category, setCategory] = useState<CategoryProject | null>(null);

  const requestDelete = useCallback((target: CategoryProject) => {
    setCategory(target);
    setIsOpen(true);
  }, []);

  // ConfirmAction closes the dialog once this resolves; errors are shown as a toast.
  const confirmDelete = async () => {
    if (!category) return;
    try {
      await deleteCategoryProject.mutateAsync(category.id);
      showToast({ status: "success", title: t("categoryProjectDeleted"), dir });
    } catch (error) {
      toastApiError(error, { dir });
    }
  };

  const question = category
    ? t("categoryProjectDeleteQuestion", {
        name: localized(locale, category.nameEn, category.nameAr),
      })
    : "";

  return {
    isOpen,
    onOpenChange: setIsOpen,
    question,
    requestDelete,
    confirmDelete,
    isDeleting: deleteCategoryProject.isPending,
  };
}
