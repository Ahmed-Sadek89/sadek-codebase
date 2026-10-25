"use client";

import { useCallback, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useToggleCategoryProjectActive } from "@repo/hooks/category-projects";
import { showToast, toastApiError } from "@repo/libs/toast";
import type { CategoryProject } from "@repo/types/category-projects";
import { getDirection } from "../../../i18n/config";
import { localized } from "../../../utils/format";

/**
 * Active ⇄ inactive for a row: ask in a ConfirmAction, then call
 * PATCH /category-projects/:id/toggle-active. Inactive categories are hidden from the website.
 */
export function useToggleCategoryProjectActiveAction() {
  const t = useTranslations();
  const locale = useLocale();
  const dir = getDirection(locale);
  const toggleCategoryProjectActive = useToggleCategoryProjectActive();
  const [isOpen, setIsOpen] = useState(false);
  // Kept after closing so the question doesn't change during the close animation.
  const [category, setCategory] = useState<CategoryProject | null>(null);

  const requestToggle = useCallback((target: CategoryProject) => {
    setCategory(target);
    setIsOpen(true);
  }, []);

  // ConfirmAction closes the dialog once this resolves; errors are shown as a toast.
  const confirmToggle = async () => {
    if (!category) return;
    try {
      const { isActive } = await toggleCategoryProjectActive.mutateAsync(
        category.id,
      );
      showToast({
        status: "success",
        title: isActive
          ? t("categoryProjectActivated")
          : t("categoryProjectDeactivated"),
        dir,
      });
    } catch (error) {
      toastApiError(error, { dir });
    }
  };

  const name = category
    ? localized(locale, category.nameEn, category.nameAr)
    : "";
  const question = !category
    ? ""
    : category.isActive
      ? t("categoryProjectDeactivateQuestion", { name })
      : t("categoryProjectActivateQuestion", { name });

  return {
    isOpen,
    onOpenChange: setIsOpen,
    question,
    requestToggle,
    confirmToggle,
    isToggling: toggleCategoryProjectActive.isPending,
  };
}
