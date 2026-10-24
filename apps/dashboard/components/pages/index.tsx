"use client";

import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { usePages } from "@repo/hooks/pages";
import type { Page } from "@repo/types/pages";
import { FilePlus2, Pencil } from "@repo/ui/icons";
import { DynamicTable } from "../ui/dynamic-table";
import { ConfirmAction } from "../ui/confirm-action";
import useColumns from "./hooks/use-columns";
import { useStaticFilter } from "./hooks/use-static-filter";
import { useDeletePageAction } from "./hooks/use-delete-page";
import { readListQueryParams } from "../../utils/list-query";
import { getPagesQuery } from "./utils/constants";
import { PageForm } from "./components/page-form";

export default function PagesPage() {
  const t = useTranslations();
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const handleOpenDialog = useCallback((open: boolean) => {
    setIsOpenDialog(open);
  }, []);
  const handleCreate = useCallback(() => {
    setSelectedPage(null);
    setIsOpenDialog(true);
  }, []);
  const handleEdit = useCallback((page: Page) => {
    setSelectedPage(page);
    setIsOpenDialog(true);
  }, []);
  const isEditing = selectedPage !== null;
  const searchParams = useSearchParams();
  const query = useMemo(
    () => getPagesQuery(readListQueryParams((name) => searchParams.get(name))),
    [searchParams],
  );
  const { data, isPending, isFetching, isError, refetch } = usePages(query);
  const staticFilter = useStaticFilter();
  const deleteAction = useDeletePageAction();
  const columns = useColumns({
    busy: deleteAction.isDeleting,
    canUpdate: true,
    canDelete: true,
    onEdit: handleEdit,
    onDelete: deleteAction.requestDelete,
  });

  return (
    <main className="space-y-6">
      <DynamicTable
        title={t("pagesTitle")}
        description={t("pagesDescription")}
        columns={columns}
        data={data?.data}
        getRowId={(page) => String(page.id)}
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
      <PageForm
        isOpenDialog={isOpenDialog}
        handleOpenDialog={handleOpenDialog}
        title={isEditing ? t("pageFormEditTitle") : t("pageFormTitle")}
        description={isEditing ? t("pageFormEditDescription") : t("pageFormDescription")}
        Icon={isEditing ? Pencil : FilePlus2}
        role={isEditing ? "edit" : "create"}
        defaultValues={selectedPage}
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
