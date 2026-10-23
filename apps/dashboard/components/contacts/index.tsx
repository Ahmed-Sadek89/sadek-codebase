"use client";

import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useContacts } from "@repo/hooks/contacts";
import type { Contact } from "@repo/types/contacts";
import { DynamicTable } from "../ui/dynamic-table";
import { ConfirmAction } from "../ui/confirm-action";
import useColumns from "./hooks/use-columns";
import { useStaticFilter } from "./hooks/use-static-filter";
import { useDeleteContactAction } from "./hooks/use-delete-contact";
import { readListQueryParams } from "../../utils/list-query";
import { getContactsQuery } from "./utils/constants";
import { ContactDetailsDialog } from "./components";

/**
 * Messages from the portfolio's contact form (GET /contacts). Each row can be
 * viewed (full message) or deleted; there is no create or edit. Data is prefetched in the route's page.tsx.
 */
export default function ContactsPage() {
  const t = useTranslations();
  // Same query as the server prefetch, so the hydrated cache is reused.
  const searchParams = useSearchParams();
  const query = useMemo(
    () =>
      getContactsQuery(readListQueryParams((name) => searchParams.get(name))),
    [searchParams],
  );
  const { data, isPending, isFetching, isError, refetch } = useContacts(query);
  const staticFilter = useStaticFilter();
  const deleteAction = useDeleteContactAction();
  // The row whose full message is open; kept while the dialog closes.
  const [viewed, setViewed] = useState<Contact | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const handleView = useCallback((contact: Contact) => {
    setViewed(contact);
    setIsViewOpen(true);
  }, []);
  const columns = useColumns({
    busy: deleteAction.isDeleting,
    canView: true,
    canDelete: true,
    onView: handleView,
    onDelete: deleteAction.requestDelete,
  });

  return (
    <main className="space-y-6">
      <DynamicTable
        title={t("contactsTitle")}
        description={t("contactsDescription")}
        columns={columns}
        data={data?.data}
        getRowId={(contact) => String(contact.id)}
        isLoading={isPending}
        isError={isError}
        onRetry={() => void refetch()}
        onReload={() => void refetch()}
        isRefreshing={isFetching}
        pagination={data}
        staticFilter={staticFilter}
      />
      <ContactDetailsDialog
        contact={viewed}
        onOpenChange={setIsViewOpen}
        open={isViewOpen}
      />
      <ConfirmAction
        open={deleteAction.isOpen}
        onOpenChange={deleteAction.onOpenChange}
        question={deleteAction.question}
        onConfirm={deleteAction.confirmDelete}
      />
    </main>
  );
}
