"use client";

import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useSkills } from "@repo/hooks/skills";
import type { Skill } from "@repo/types/skills";
import { Pencil, Sparkles } from "@repo/ui/icons";
import { DynamicTable } from "../ui/dynamic-table";
import { ConfirmAction } from "../ui/confirm-action";
import useColumns from "./hooks/use-columns";
import { useStaticFilter } from "./hooks/use-static-filter";
import { useDynamicFilter } from "./hooks/use-dynamic-filter";
import { useDeleteSkillAction } from "./hooks/use-delete-skill";
import { useToggleSkillActiveAction } from "./hooks/use-toggle-skill-active";
import { SkillsForm } from "./components/skills-form";
import { SkillDetailsDialog } from "./components/skill-details-dialog";
import { getSkillsQuery } from "./utils/constants";

/** All skills page content. Data is prefetched in the route's page.tsx. */
export default function SkillsPage() {
  const t = useTranslations();
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  // The row being edited; null while creating.
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const handleOpenDialog = useCallback((open: boolean) => {
    setIsOpenDialog(open);
  }, []);
  const handleCreate = useCallback(() => {
    setSelectedSkill(null);
    setIsOpenDialog(true);
  }, []);
  const handleEdit = useCallback((skill: Skill) => {
    setSelectedSkill(skill);
    setIsOpenDialog(true);
  }, []);
  const isEditing = selectedSkill !== null;
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  // Kept after closing so the content doesn't vanish during the close animation.
  const [viewedSkill, setViewedSkill] = useState<Skill | null>(null);
  const handleView = useCallback((skill: Skill) => {
    setViewedSkill(skill);
    setIsDetailsOpen(true);
  }, []);
  // ?search=&page=&limit=&order=&isActive=&categoryId= (any combination).
  const searchParams = useSearchParams();
  // Same query as the server prefetch, so the hydrated cache is reused.
  const query = useMemo(
    () =>
      getSkillsQuery((name) => searchParams.get(name)),
    [searchParams],
  );
  const { data, isPending, isFetching, isError, refetch } = useSkills(query);
  const staticFilter = useStaticFilter();
  const dynamicFilter = useDynamicFilter();
  const deleteAction = useDeleteSkillAction();
  const toggleAction = useToggleSkillActiveAction();
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
        title={t("skillsTitle")}
        description={t("skillsDescription")}
        columns={columns}
        data={data?.data}
        getRowId={(skill) => String(skill.id)}
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
      <SkillsForm
        isOpenDialog={isOpenDialog}
        handleOpenDialog={handleOpenDialog}
        title={isEditing ? t("skillFormEditTitle") : t("skillFormTitle")}
        description={
          isEditing ? t("skillFormEditDescription") : t("skillFormDescription")
        }
        Icon={isEditing ? Pencil : Sparkles}
        role={isEditing ? "edit" : "create"}
        defaultValues={selectedSkill}
      />
      <SkillDetailsDialog
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        skill={viewedSkill}
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
