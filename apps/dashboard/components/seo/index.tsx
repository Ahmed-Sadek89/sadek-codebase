"use client";

import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useSeoList } from "@repo/hooks/seo";
import type { Seo } from "@repo/types/seo";
import { FilePlus2, Pencil } from "@repo/ui/icons";
import { DynamicTable } from "../ui/dynamic-table";
import { ConfirmAction } from "../ui/confirm-action";
import useColumns from "./hooks/use-columns";
import { useStaticFilter } from "./hooks/use-static-filter";
import { useDynamicFilter } from "./hooks/use-dynamic-filter";
import { useDeleteSeoAction } from "./hooks/use-delete-seo";
import { useToggleSeoActiveAction } from "./hooks/use-toggle-seo-active";
import { getSeoListQuery } from "./utils/constants";
import { SeoForm } from "./components/seo-form";
import { SeoDetailsDialog } from "./components/seo-details-dialog";

export default function SeoPage() {
  const t = useTranslations();
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [selectedSeo, setSelectedSeo] = useState<Seo | null>(null);
  const handleOpenDialog = useCallback((open: boolean) => {
    setIsOpenDialog(open);
  }, []);
  const handleCreate = useCallback(() => {
    setSelectedSeo(null);
    setIsOpenDialog(true);
  }, []);
  const handleEdit = useCallback((seo: Seo) => {
    setSelectedSeo(seo);
    setIsOpenDialog(true);
  }, []);
  const [viewedSeo, setViewedSeo] = useState<Seo | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const handleView = useCallback((seo: Seo) => {
    setViewedSeo(seo);
    setIsDetailsOpen(true);
  }, []);
  const isEditing = selectedSeo !== null;
  const searchParams = useSearchParams();
  const query = useMemo(
    () =>
getSeoListQuery((name) => searchParams.get(name)),
    [searchParams],
  );
  const { data, isPending, isFetching, isError, refetch } =
    useSeoList(query);
  const staticFilter = useStaticFilter();
  const dynamicFilter = useDynamicFilter();
  const deleteAction = useDeleteSeoAction();
  const toggleAction = useToggleSeoActiveAction();
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
        title={t("seoTitle")}
        description={t("seoDescription")}
        columns={columns}
        data={data?.data}
        getRowId={(seo) => String(seo.id)}
        isLoading={isPending}
        isError={isError}
        onRetry={() => void refetch()}
        onReload={() => void refetch()}
        isRefreshing={isFetching}
        pagination={data}
        showCreate={true}
        makeCreateAction={handleCreate}
        staticFilter={staticFilter}
        dynamicFilter={dynamicFilter}
      />
      <SeoForm
        isOpenDialog={isOpenDialog}
        handleOpenDialog={handleOpenDialog}
        title={
          isEditing
            ? t("seoFormEditTitle")
            : t("seoFormTitle")
        }
        description={
          isEditing
            ? t("seoFormEditDescription")
            : t("seoFormDescription")
        }
        Icon={isEditing ? Pencil : FilePlus2}
        role={isEditing ? "edit" : "create"}
        defaultValues={selectedSeo}
      />
      <SeoDetailsDialog
        seo={viewedSeo}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
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
