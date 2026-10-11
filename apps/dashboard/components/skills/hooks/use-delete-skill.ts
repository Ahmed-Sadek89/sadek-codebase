"use client";

import { useCallback, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useDeleteSkill } from "@repo/hooks/skills";
import { showToast, toastApiError } from "@repo/libs/toast";
import type { Skill } from "@repo/types/skills";
import { getDirection } from "../../../i18n/config";
import { deleteFile } from "../../../libs/upload/delete-file";
import { localized } from "../../../utils/format";

/**
 * Delete flow for a row: ask in a ConfirmAction, then delete the skill's
 * uploaded icon, then call DELETE /skills/:id.
 */
export function useDeleteSkillAction() {
  const t = useTranslations();
  const locale = useLocale();
  const dir = getDirection(locale);
  const deleteSkill = useDeleteSkill();
  const [isOpen, setIsOpen] = useState(false);
  // Kept after closing so the question doesn't change during the close animation.
  const [skill, setSkill] = useState<Skill | null>(null);

  const requestDelete = useCallback((target: Skill) => {
    setSkill(target);
    setIsOpen(true);
  }, []);

  // ConfirmAction closes the dialog once this resolves; errors are shown as a toast.
  const confirmDelete = async () => {
    if (!skill) return;
    try {
      // 1. The icon first (only our own uploads; never throws), 2. the row.
      await deleteFile(skill.avatar_url);
      await deleteSkill.mutateAsync(skill.id);
      showToast({ status: "success", title: t("skillDeleted"), dir });
    } catch (error) {
      toastApiError(error, { dir });
    }
  };

  const question = skill
    ? t("skillDeleteQuestion", {
        name: localized(locale, skill.nameEn, skill.nameAr),
      })
    : "";

  return {
    isOpen,
    onOpenChange: setIsOpen,
    question,
    requestDelete,
    confirmDelete,
    isDeleting: deleteSkill.isPending,
  };
}
