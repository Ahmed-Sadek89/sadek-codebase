"use client";

import { useCallback, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useDeleteUserCompany } from "@repo/hooks/user-company";
import { showToast, toastApiError } from "@repo/libs/toast";
import type { UserCompanyDetails } from "@repo/types/user-company";
import { getDirection } from "../../../i18n/config";
import { deleteFile } from "../../../libs/upload/delete-file";
import { localized } from "../../../utils/format";

/**
 * Delete flow for a row: ask in a ConfirmAction, then delete the company's
 * uploaded logo, then call DELETE /user-company/:id.
 */
export function useDeleteUserCompanyAction() {
  const t = useTranslations();
  const locale = useLocale();
  const dir = getDirection(locale);
  const deleteUserCompany = useDeleteUserCompany();
  const [isOpen, setIsOpen] = useState(false);
  // Kept after closing so the question doesn't change during the close animation.
  const [company, setCompany] = useState<UserCompanyDetails | null>(null);

  const requestDelete = useCallback((target: UserCompanyDetails) => {
    setCompany(target);
    setIsOpen(true);
  }, []);

  // ConfirmAction closes the dialog once this resolves; errors are shown as a toast.
  const confirmDelete = async () => {
    if (!company) return;
    try {
      // 1. The logo first (only our own uploads; never throws), 2. the row.
      await deleteFile(company.logo);
      await deleteUserCompany.mutateAsync(company.id);
      showToast({ status: "success", title: t("userCompanyDeleted"), dir });
    } catch (error) {
      toastApiError(error, { dir });
    }
  };

  const question = company
    ? t("userCompanyDeleteQuestion", {
        name: localized(locale, company.name_en, company.name_ar),
      })
    : "";

  return {
    isOpen,
    onOpenChange: setIsOpen,
    question,
    requestDelete,
    confirmDelete,
    isDeleting: deleteUserCompany.isPending,
  };
}
