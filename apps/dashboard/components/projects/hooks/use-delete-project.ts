"use client";

import { useCallback, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useDeleteProject } from "@repo/hooks/projects";
import { showToast, toastApiError } from "@repo/libs/toast";
import type { Project } from "@repo/types/projects";
import { getDirection } from "../../../i18n/config";
import { deleteFile } from "../../../libs/upload/delete-file";
import { localized } from "../../../utils/format";

/**
 * Delete flow for a row: ask in a ConfirmAction, then delete the project's
 * uploaded main image, then call DELETE /projects/:id.
 */
export function useDeleteProjectAction() {
  const t = useTranslations();
  const locale = useLocale();
  const dir = getDirection(locale);
  const deleteProject = useDeleteProject();
  const [isOpen, setIsOpen] = useState(false);
  // Kept after closing so the question doesn't change during the close animation.
  const [project, setProject] = useState<Project | null>(null);

  const requestDelete = useCallback((target: Project) => {
    setProject(target);
    setIsOpen(true);
  }, []);

  // ConfirmAction closes the dialog once this resolves; errors are shown as a toast.
  const confirmDelete = async () => {
    if (!project) return;
    try {
      // 1. The image first (only our own uploads; never throws), 2. the row.
      await deleteFile(project.mainImageUrl);
      await deleteProject.mutateAsync(project.id);
      showToast({ status: "success", title: t("projectDeleted"), dir });
    } catch (error) {
      toastApiError(error, { dir });
    }
  };

  const question = project
    ? t("projectDeleteQuestion", {
        name: localized(locale, project.nameEn, project.nameAr),
      })
    : "";

  return {
    isOpen,
    onOpenChange: setIsOpen,
    question,
    requestDelete,
    confirmDelete,
    isDeleting: deleteProject.isPending,
  };
}
