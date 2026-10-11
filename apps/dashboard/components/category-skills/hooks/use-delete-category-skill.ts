"use client";

import { useCallback, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useDeleteCategorySkill } from "@repo/hooks/category-skills";
import { showToast, toastApiError } from "@repo/libs/toast";
import type { CategorySkill } from "@repo/types/category-skills";
import { getDirection } from "../../../i18n/config";
import { localized } from "../../../utils/format";

/** Delete flow for a row: ask in a ConfirmAction, then call DELETE /category-skills/:id. */
export function useDeleteCategorySkillAction() {
  const t = useTranslations();
  const locale = useLocale();
  const dir = getDirection(locale);
  const deleteCategorySkill = useDeleteCategorySkill();
  const [isOpen, setIsOpen] = useState(false);
  // Kept after closing so the question doesn't change during the close animation.
  const [category, setCategory] = useState<CategorySkill | null>(null);

  const requestDelete = useCallback((target: CategorySkill) => {
    setCategory(target);
    setIsOpen(true);
  }, []);

  // ConfirmAction closes the dialog once this resolves; errors are shown as a toast.
  const confirmDelete = async () => {
    if (!category) return;
    try {
      await deleteCategorySkill.mutateAsync(category.id);
      showToast({ status: "success", title: t("categorySkillDeleted"), dir });
    } catch (error) {
      toastApiError(error, { dir });
    }
  };

  const question = category
    ? t("categorySkillDeleteQuestion", {
        name: localized(locale, category.nameEn, category.nameAr),
      })
    : "";

  return {
    isOpen,
    onOpenChange: setIsOpen,
    question,
    requestDelete,
    confirmDelete,
    isDeleting: deleteCategorySkill.isPending,
  };
}
