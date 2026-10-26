"use client";

import { useCallback, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useToggleInstructorExperienceActive } from "@repo/hooks/instructor-experience";
import { showToast, toastApiError } from "@repo/libs/toast";
import type { InstructorExperience } from "@repo/types/instructor-experience";
import { getDirection } from "../../../i18n/config";

/**
 * Active ⇄ inactive: ask in a ConfirmAction, then call
 * PATCH /instructor-experience/:id/toggle-active. Inactive rows are hidden from the website.
 */
export function useToggleInstructorExperienceActiveAction() {
  const t = useTranslations();
  const dir = getDirection(useLocale());
  const toggleActive = useToggleInstructorExperienceActive();
  const [isOpen, setIsOpen] = useState(false);
  // Kept after closing so the question doesn't change during the close animation.
  const [target, setTarget] = useState<InstructorExperience | null>(null);

  const requestToggle = useCallback((row: InstructorExperience) => {
    setTarget(row);
    setIsOpen(true);
  }, []);

  // ConfirmAction closes the dialog once this resolves; errors are shown as a toast.
  const confirmToggle = async () => {
    if (!target) return;
    try {
      const { isActive } = await toggleActive.mutateAsync(target.id);
      showToast({
        status: "success",
        title: isActive
          ? t("instructorExperienceActivated")
          : t("instructorExperienceDeactivated"),
        dir,
      });
    } catch (error) {
      toastApiError(error, { dir });
    }
  };

  const question = !target
    ? ""
    : target.isActive
      ? t("instructorExperienceDeactivateQuestion", { name: target.name })
      : t("instructorExperienceActivateQuestion", { name: target.name });

  return {
    isOpen,
    onOpenChange: setIsOpen,
    question,
    requestToggle,
    confirmToggle,
    isToggling: toggleActive.isPending,
  };
}
