"use client";

import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCategoryProjects } from "@repo/hooks/category-projects";
import { DynamicTable } from "../ui/dynamic-table";
import useColumns from "./hooks/use-columns";
import { useStaticFilter } from "./hooks/use-static-filter";
import { readListQueryParams } from "../../utils/list-query";
import { getCategoryProjectsQuery } from "./utils/constants";
import { CategoryProjectsForm } from "./components/category-projects-form";
import { useDeleteCategoryProjectAction } from "./hooks/use-delete-category-project";
import { useToggleCategoryProjectActiveAction } from "./hooks/use-toggle-category-project-active";
import { CategoryProjectDetailsDialog } from "./components/category-project-details-dialog";
import { ConfirmAction } from "../ui/confirm-action";
import { FolderPlus, Pencil } from "@repo/ui/icons";
import type { CategoryProject } from "@repo/types/category-projects";

export default function CategoryProjectsPage() {
  const t = useTranslations();
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryProject | null>(null);
  const handleOpenDialog = useCallback((open: boolean) => {
    setIsOpenDialog(open);
  }, []);
  const handleCreate = useCallback(() => {
    setSelectedCategory(null);
    setIsOpenDialog(true);
  }, []);
  const handleEdit = useCallback((category: CategoryProject) => {
    setSelectedCategory(category);
    setIsOpenDialog(true);
  }, []);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  // Kept after closing so the content doesn't vanish during the close animation.
  const [viewedCategory, setViewedCategory] = useState<CategoryProject | null>(
    null,
  );
  const handleView = useCallback((category: CategoryProject) => {
    setViewedCategory(category);
    setIsDetailsOpen(true);
  }, []);
  const isEditing = selectedCategory !== null;
  const searchParams = useSearchParams();
  const query = useMemo(
    () =>
      getCategoryProjectsQuery(
        readListQueryParams((name) => searchParams.get(name)),
      ),
    [searchParams],
  );
  const { data, isPending, isFetching, isError, refetch } =
    useCategoryProjects(query);
  const staticFilter = useStaticFilter();
  const deleteAction = useDeleteCategoryProjectAction();
  const toggleAction = useToggleCategoryProjectActiveAction();
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
        title={t("categoryProjectsTitle")}
        description={t("categoryProjectsDescription")}
        columns={columns}
        data={data?.data}
        getRowId={(category) => String(category.id)}
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
      <CategoryProjectsForm
        isOpenDialog={isOpenDialog}
        handleOpenDialog={handleOpenDialog}
        title={
          isEditing
            ? t("categoryProjectFormEditTitle")
            : t("categoryProjectFormTitle")
        }
        description={
          isEditing
            ? t("categoryProjectFormEditDescription")
            : t("categoryProjectFormDescription")
        }
        Icon={isEditing ? Pencil : FolderPlus}
        role={isEditing ? "edit" : "create"}
        defaultValues={selectedCategory}
      />
      <CategoryProjectDetailsDialog
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        category={viewedCategory}
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
