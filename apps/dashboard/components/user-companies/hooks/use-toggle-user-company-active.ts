"use client";

import { useCallback, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useToggleUserCompanyActive } from "@repo/hooks/user-company";
import { showToast, toastApiError } from "@repo/libs/toast";
import type { UserCompanyDetails } from "@repo/types/user-company";
import { getDirection } from "../../../i18n/config";

/**
 * Active ⇄ inactive for a row: ask in a ConfirmAction, then call
 * PATCH /user-company/:id/toggle-active. Inactive companies are hidden from the website.
 */
export function useToggleUserCompanyActiveAction() {
  const t = useTranslations();
  const dir = getDirection(useLocale());
  const toggleUserCompanyActive = useToggleUserCompanyActive();
  const [isOpen, setIsOpen] = useState(false);
  // Kept after closing so the question doesn't change during the close animation.
  const [company, setCompany] = useState<UserCompanyDetails | null>(null);

  const requestToggle = useCallback((target: UserCompanyDetails) => {
    setCompany(target);
    setIsOpen(true);
  }, []);

  // ConfirmAction closes the dialog once this resolves; errors are shown as a toast.
  const confirmToggle = async () => {
    if (!company) return;
    try {
      const { isActive } = await toggleUserCompanyActive.mutateAsync(company.id);
      showToast({
        status: "success",
        title: isActive
          ? t("userCompanyActivated")
          : t("userCompanyDeactivated"),
        dir,
      });
    } catch (error) {
      toastApiError(error, { dir });
    }
  };

  const name = company?.company_name ?? "";
  const question = !company
    ? ""
    : company.isActive
      ? t("userCompanyDeactivateQuestion", { name })
      : t("userCompanyActivateQuestion", { name });

  return {
    isOpen,
    onOpenChange: setIsOpen,
    question,
    requestToggle,
    confirmToggle,
    isToggling: toggleUserCompanyActive.isPending,
  };
}
