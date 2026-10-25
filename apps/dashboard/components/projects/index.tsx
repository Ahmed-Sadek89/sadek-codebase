"use client";

import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useRouter } from "../../i18n/navigation";
import { useProjects } from "@repo/hooks/projects";
import type { Project } from "@repo/types/projects";
import { DynamicTable } from "../ui/dynamic-table";
import { ConfirmAction } from "../ui/confirm-action";
import useColumns from "./hooks/use-columns";
import { useStaticFilter } from "./hooks/use-static-filter";
import { useDynamicFilter } from "./hooks/use-dynamic-filter";
import { useDeleteProjectAction } from "./hooks/use-delete-project";
import { ProjectDetailsDialog } from "./components/project-details-dialog";
import { getProjectsQuery } from "./utils/constants";

/** All projects page content. Data is prefetched in the route's page.tsx. */
export default function ProjectsPage() {
  const t = useTranslations();
  const router = useRouter();
  // Creating and editing happen on their own page: /dashboard/projects/form/[slug].
  const handleCreate = useCallback(() => {
    router.push("/dashboard/projects/form/create");
  }, [router]);
  const handleEdit = useCallback(
    (project: Project) => {
      router.push(`/dashboard/projects/form/${project.id}`);
    },
    [router],
  );
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  // Kept after closing so the content doesn't vanish during the close animation.
  const [viewedProject, setViewedProject] = useState<Project | null>(null);
  const handleView = useCallback((project: Project) => {
    setViewedProject(project);
    setIsDetailsOpen(true);
  }, []);
  // ?search=&page=&limit=&order=&isActive=&categoryId= (any combination).
  const searchParams = useSearchParams();
  // Same query as the server prefetch, so the hydrated cache is reused.
  const query = useMemo(
    () =>
      getProjectsQuery((name) => searchParams.get(name)),
    [searchParams],
  );
  const { data, isPending, isFetching, isError, refetch } = useProjects(query);
  const staticFilter = useStaticFilter();
  const dynamicFilter = useDynamicFilter();
  const deleteAction = useDeleteProjectAction();
  const columns = useColumns({
    busy: deleteAction.isDeleting,
    canView: true,
    canUpdate: true,
    canDelete: true,
    onView: handleView,
    onEdit: handleEdit,
    onDelete: deleteAction.requestDelete,
  });

  return (
    <main className="space-y-6">
      <DynamicTable
        title={t("projectsTitle")}
        description={t("projectsDescription")}
        columns={columns}
        data={data?.data}
        getRowId={(project) => String(project.id)}
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
      <ProjectDetailsDialog
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        project={viewedProject}
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
