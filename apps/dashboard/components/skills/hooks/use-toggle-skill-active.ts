"use client";

import { useCallback, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useToggleSkillActive } from "@repo/hooks/skills";
import { showToast, toastApiError } from "@repo/libs/toast";
import type { Skill } from "@repo/types/skills";
import { getDirection } from "../../../i18n/config";

/**
 * Active ⇄ inactive for a row: ask in a ConfirmAction, then call
 * PATCH /skills/:id/toggle-active. Inactive skills are hidden from the website.
 */
export function useToggleSkillActiveAction() {
  const t = useTranslations();
  const dir = getDirection(useLocale());
  const toggleSkillActive = useToggleSkillActive();
  const [isOpen, setIsOpen] = useState(false);
  // Kept after closing so the question doesn't change during the close animation.
  const [skill, setSkill] = useState<Skill | null>(null);

  const requestToggle = useCallback((target: Skill) => {
    setSkill(target);
    setIsOpen(true);
  }, []);

  // ConfirmAction closes the dialog once this resolves; errors are shown as a toast.
  const confirmToggle = async () => {
    if (!skill) return;
    try {
      const { isActive } = await toggleSkillActive.mutateAsync(skill.id);
      showToast({
        status: "success",
        title: isActive ? t("skillActivated") : t("skillDeactivated"),
        dir,
      });
    } catch (error) {
      toastApiError(error, { dir });
    }
  };

  const name = skill?.name ?? "";
  const question = !skill
    ? ""
    : skill.isActive
      ? t("skillDeactivateQuestion", { name })
      : t("skillActivateQuestion", { name });

  return {
    isOpen,
    onOpenChange: setIsOpen,
    question,
    requestToggle,
    confirmToggle,
    isToggling: toggleSkillActive.isPending,
  };
}
