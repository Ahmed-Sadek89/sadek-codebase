"use client";

import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCategorySkills } from "@repo/hooks/category-skills";
import { DynamicTable } from "../ui/dynamic-table";
import useColumns from "./hooks/use-columns";
import { readListQueryParams } from "../../utils/list-query";
import { getCategorySkillsQuery } from "./utils/constants";
import { CategorySkillsForm } from "./components/category-skills-form";
import { useDeleteCategorySkillAction } from "./hooks/use-delete-category-skill";
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
  const deleteAction = useDeleteCategorySkillAction();
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
      <ConfirmAction
        open={deleteAction.isOpen}
        onOpenChange={deleteAction.onOpenChange}
        question={deleteAction.question}
        onConfirm={deleteAction.confirmDelete}
      />
    </main>
  );
}
