"use client";

import { useCallback, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useDeleteContact } from "@repo/hooks/contacts";
import { showToast, toastApiError } from "@repo/libs/toast";
import type { Contact } from "@repo/types/contacts";
import { getDirection } from "../../../i18n/config";

/** Delete flow for a row: ask in a ConfirmAction, then call DELETE /contacts/:id. */
export function useDeleteContactAction() {
  const t = useTranslations();
  const dir = getDirection(useLocale());
  const deleteContact = useDeleteContact();
  const [isOpen, setIsOpen] = useState(false);
  // Kept after closing so the question doesn't change during the close animation.
  const [contact, setContact] = useState<Contact | null>(null);

  const requestDelete = useCallback((target: Contact) => {
    setContact(target);
    setIsOpen(true);
  }, []);

  // ConfirmAction closes the dialog once this resolves; errors are shown as a toast.
  const confirmDelete = async () => {
    if (!contact) return;
    try {
      await deleteContact.mutateAsync(contact.id);
      showToast({ status: "success", title: t("contactDeleted"), dir });
    } catch (error) {
      toastApiError(error, { dir });
    }
  };

  const question = contact
    ? t("contactDeleteQuestion", {
        name: contact.name,
        subject: contact.subject,
      })
    : "";

  return {
    isOpen,
    onOpenChange: setIsOpen,
    question,
    requestDelete,
    confirmDelete,
    isDeleting: deleteContact.isPending,
  };
}
