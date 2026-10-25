"use client";

import { useCallback, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useToggleCategorySkillActive } from "@repo/hooks/category-skills";
import { showToast, toastApiError } from "@repo/libs/toast";
import type { CategorySkill } from "@repo/types/category-skills";
import { getDirection } from "../../../i18n/config";
import { localized } from "../../../utils/format";

/**
 * Active ⇄ inactive for a row: ask in a ConfirmAction, then call
 * PATCH /category-skills/:id/toggle-active. Inactive categories are hidden from the website.
 */
export function useToggleCategorySkillActiveAction() {
  const t = useTranslations();
  const locale = useLocale();
  const dir = getDirection(locale);
  const toggleCategorySkillActive = useToggleCategorySkillActive();
  const [isOpen, setIsOpen] = useState(false);
  // Kept after closing so the question doesn't change during the close animation.
  const [category, setCategory] = useState<CategorySkill | null>(null);

  const requestToggle = useCallback((target: CategorySkill) => {
    setCategory(target);
    setIsOpen(true);
  }, []);

  // ConfirmAction closes the dialog once this resolves; errors are shown as a toast.
  const confirmToggle = async () => {
    if (!category) return;
    try {
      const { isActive } = await toggleCategorySkillActive.mutateAsync(
        category.id,
      );
      showToast({
        status: "success",
        title: isActive
          ? t("categorySkillActivated")
          : t("categorySkillDeactivated"),
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
      ? t("categorySkillDeactivateQuestion", { name })
      : t("categorySkillActivateQuestion", { name });

  return {
    isOpen,
    onOpenChange: setIsOpen,
    question,
    requestToggle,
    confirmToggle,
    isToggling: toggleCategorySkillActive.isPending,
  };
}
