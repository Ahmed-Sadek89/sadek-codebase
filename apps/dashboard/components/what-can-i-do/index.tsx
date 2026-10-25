"use client";

import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useMyWhatCanDos } from "@repo/hooks/what-can-do";
import type { WhatCanDoDetails } from "@repo/types/what-can-do";
import { Pencil, Sparkles } from "@repo/ui/icons";
import { DynamicTable } from "../ui/dynamic-table";
import { ConfirmAction } from "../ui/confirm-action";
import useColumns from "./hooks/use-columns";
import { useStaticFilter } from "./hooks/use-static-filter";
import { useDeleteWhatCanDoAction } from "./hooks/use-delete-what-can-do";
import { useToggleWhatCanDoActiveAction } from "./hooks/use-toggle-what-can-do-active";
import { WhatCanDoForm } from "./components/what-can-do-form";
import { WhatCanDoDetailsDialog } from "./components/what-can-do-details-dialog";
import { readListQueryParams } from "../../utils/list-query";
import { getWhatCanDosQuery } from "./utils/constants";

/** "What I can do" page content. Data is prefetched in the route's page.tsx. */
export default function WhatCanIDoPage() {
  const t = useTranslations();
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  // The row being edited; null while creating.
  const [selectedItem, setSelectedItem] = useState<WhatCanDoDetails | null>(
    null,
  );
  const handleOpenDialog = useCallback((open: boolean) => {
    setIsOpenDialog(open);
  }, []);
  const handleCreate = useCallback(() => {
    setSelectedItem(null);
    setIsOpenDialog(true);
  }, []);
  const handleEdit = useCallback((item: WhatCanDoDetails) => {
    setSelectedItem(item);
    setIsOpenDialog(true);
  }, []);
  const isEditing = selectedItem !== null;
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  // Kept after closing so the content doesn't vanish during the close animation.
  const [viewedItem, setViewedItem] = useState<WhatCanDoDetails | null>(null);
  const handleView = useCallback((item: WhatCanDoDetails) => {
    setViewedItem(item);
    setIsDetailsOpen(true);
  }, []);
  // Same query as the server prefetch, so the hydrated cache is reused.
  const searchParams = useSearchParams();
  const query = useMemo(
    () =>
      getWhatCanDosQuery(readListQueryParams((name) => searchParams.get(name))),
    [searchParams],
  );
  const { data, isPending, isFetching, isError, refetch } =
    useMyWhatCanDos(query);
  const staticFilter = useStaticFilter();
  const deleteAction = useDeleteWhatCanDoAction();
  const toggleAction = useToggleWhatCanDoActiveAction();
  const columns = useColumns({
    busy: deleteAction.isDeleting || toggleAction.isToggling,
    canView: true,
    canUpdate: true,
    canDelete: true,
    canToggleActive: true,
    onView: handleView,
    onEdit: handleEdit,
    onDelete: deleteAction.requestDelete,
    onToggleActive: toggleAction.requestToggle,
  });

  return (
    <main className="space-y-6">
      <DynamicTable
        title={t("whatCanIDoTitle")}
        description={t("whatCanIDoDescription")}
        columns={columns}
        data={data?.data}
        getRowId={(item) => String(item.id)}
        isLoading={isPending}
        isError={isError}
        onRetry={() => void refetch()}
        onReload={() => void refetch()}
        isRefreshing={isFetching}
        pagination={data}
        showCreate={true}
        makeCreateAction={handleCreate}
        staticFilter={staticFilter}
      />
      <WhatCanDoForm
        isOpenDialog={isOpenDialog}
        handleOpenDialog={handleOpenDialog}
        title={isEditing ? t("whatCanDoFormEditTitle") : t("whatCanDoFormTitle")}
        description={
          isEditing
            ? t("whatCanDoFormEditDescription")
            : t("whatCanDoFormDescription")
        }
        Icon={isEditing ? Pencil : Sparkles}
        role={isEditing ? "edit" : "create"}
        defaultValues={selectedItem}
        // Unfiltered total = the number of items, so a new one goes last.
        nextRank={query.search ? undefined : data?.total}
      />
      <WhatCanDoDetailsDialog
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        item={viewedItem}
      />
      <ConfirmAction
        open={toggleAction.isOpen}
        onOpenChange={toggleAction.onOpenChange}
        question={toggleAction.question}
        onConfirm={toggleAction.confirmToggle}
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
