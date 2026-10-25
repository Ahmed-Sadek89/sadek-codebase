"use client";

import { useCallback, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useToggleProjectActive } from "@repo/hooks/projects";
import { showToast, toastApiError } from "@repo/libs/toast";
import type { Project, ProjectDetails } from "@repo/types/projects";
import { getDirection } from "../../../i18n/config";
import { localized } from "../../../utils/format";

type ToggleTarget = Project | ProjectDetails;

/**
 * Active ⇄ inactive for a project: ask in a ConfirmAction, then call
 * PATCH /projects/:id/toggle-active. Inactive projects are hidden from the website.
 */
export function useToggleProjectActiveAction() {
  const t = useTranslations();
  const locale = useLocale();
  const dir = getDirection(locale);
  const toggleProjectActive = useToggleProjectActive();
  const [isOpen, setIsOpen] = useState(false);
  // Kept after closing so the question doesn't change during the close animation.
  const [project, setProject] = useState<ToggleTarget | null>(null);

  const requestToggle = useCallback((target: ToggleTarget) => {
    setProject(target);
    setIsOpen(true);
  }, []);

  // ConfirmAction closes the dialog once this resolves; errors are shown as a toast.
  const confirmToggle = async () => {
    if (!project) return;
    try {
      const { isActive } = await toggleProjectActive.mutateAsync(project.id);
      showToast({
        status: "success",
        title: isActive ? t("projectActivated") : t("projectDeactivated"),
        dir,
      });
    } catch (error) {
      toastApiError(error, { dir });
    }
  };

  const name = project ? localized(locale, project.nameEn, project.nameAr) : "";
  const question = !project
    ? ""
    : project.isActive
      ? t("projectDeactivateQuestion", { name })
      : t("projectActivateQuestion", { name });

  return {
    isOpen,
    onOpenChange: setIsOpen,
    question,
    requestToggle,
    confirmToggle,
    isToggling: toggleProjectActive.isPending,
  };
}
