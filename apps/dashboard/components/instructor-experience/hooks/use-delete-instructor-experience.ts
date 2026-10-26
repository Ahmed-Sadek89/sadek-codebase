"use client";

import { useCallback, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useDeleteInstructorExperience } from "@repo/hooks/instructor-experience";
import { showToast, toastApiError } from "@repo/libs/toast";
import type { InstructorExperience } from "@repo/types/instructor-experience";
import { getDirection } from "../../../i18n/config";
import { deleteFile } from "../../../libs/upload/delete-file";

/**
 * Delete flow for a row: ask in a ConfirmAction, then delete the uploaded
 * cover photo, then call DELETE /instructor-experience/:id.
 */
export function useDeleteInstructorExperienceAction({
  onDeleted,
}: {
  /** Runs after a successful delete, e.g. to leave the view page. */
  onDeleted?: () => void;
} = {}) {
  const t = useTranslations();
  const dir = getDirection(useLocale());
  const deleteRow = useDeleteInstructorExperience();
  const [isOpen, setIsOpen] = useState(false);
  // Kept after closing so the question doesn't change during the close animation.
  const [target, setTarget] = useState<InstructorExperience | null>(null);

  const requestDelete = useCallback((row: InstructorExperience) => {
    setTarget(row);
    setIsOpen(true);
  }, []);

  // ConfirmAction closes the dialog once this resolves; errors are shown as a toast.
  const confirmDelete = async () => {
    if (!target) return;
    try {
      // 1. The cover photo first (only our own uploads; never throws), 2. the row.
      await deleteFile(target.coverPhotoUrl);
      await deleteRow.mutateAsync(target.id);
      showToast({ status: "success", title: t("instructorExperienceDeleted"), dir });
      onDeleted?.();
    } catch (error) {
      toastApiError(error, { dir });
    }
  };

  return {
    isOpen,
    onOpenChange: setIsOpen,
    question: target
      ? t("instructorExperienceDeleteQuestion", { name: target.name })
      : "",
    requestDelete,
    confirmDelete,
    isDeleting: deleteRow.isPending,
  };
}
