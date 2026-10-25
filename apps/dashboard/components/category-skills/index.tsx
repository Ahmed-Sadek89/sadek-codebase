"use client";

import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCategorySkills } from "@repo/hooks/category-skills";
import { DynamicTable } from "../ui/dynamic-table";
import useColumns from "./hooks/use-columns";
import { useStaticFilter } from "./hooks/use-static-filter";
import { readListQueryParams } from "../../utils/list-query";
import { getCategorySkillsQuery } from "./utils/constants";
import { CategorySkillsForm } from "./components/category-skills-form";
import { useDeleteCategorySkillAction } from "./hooks/use-delete-category-skill";
import { useToggleCategorySkillActiveAction } from "./hooks/use-toggle-category-skill-active";
import { CategorySkillDetailsDialog } from "./components/category-skill-details-dialog";
import { ConfirmAction } from "../ui/confirm-action";
import { FolderPlus, Pencil } from "@repo/ui/icons";
import type { CategorySkill } from "@repo/types/category-skills";

export default function CategorySkillsPage() {
  const t = useTranslations();
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategorySkill | null>(null);
  const handleOpenDialog = useCallback((open: boolean) => {
    setIsOpenDialog(open);
  }, []);
  const handleCreate = useCallback(() => {
    setSelectedCategory(null);
    setIsOpenDialog(true);
  }, []);
  const handleEdit = useCallback((category: CategorySkill) => {
    setSelectedCategory(category);
    setIsOpenDialog(true);
  }, []);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  // Kept after closing so the content doesn't vanish during the close animation.
  const [viewedCategory, setViewedCategory] = useState<CategorySkill | null>(
    null,
  );
  const handleView = useCallback((category: CategorySkill) => {
    setViewedCategory(category);
    setIsDetailsOpen(true);
  }, []);
  const isEditing = selectedCategory !== null;
  const searchParams = useSearchParams();
  const query = useMemo(
    () =>
      getCategorySkillsQuery(
        readListQueryParams((name) => searchParams.get(name)),
      ),
    [searchParams],
  );
  const { data, isPending, isFetching, isError, refetch } =
    useCategorySkills(query);
  const staticFilter = useStaticFilter();
  const deleteAction = useDeleteCategorySkillAction();
  const toggleAction = useToggleCategorySkillActiveAction();
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
        title={t("categorySkillsTitle")}
        description={t("categorySkillsDescription")}
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
      <CategorySkillsForm
        isOpenDialog={isOpenDialog}
        handleOpenDialog={handleOpenDialog}
        title={
          isEditing
            ? t("categorySkillFormEditTitle")
            : t("categorySkillFormTitle")
        }
        description={
          isEditing
            ? t("categorySkillFormEditDescription")
            : t("categorySkillFormDescription")
        }
        Icon={isEditing ? Pencil : FolderPlus}
        role={isEditing ? "edit" : "create"}
        defaultValues={selectedCategory}
      />
      <CategorySkillDetailsDialog
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
