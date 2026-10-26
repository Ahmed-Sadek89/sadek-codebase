"use client";

import { useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useInstructorExperiences } from "@repo/hooks/instructor-experience";
import type { InstructorExperience } from "@repo/types/instructor-experience";
import { useRouter } from "../../i18n/navigation";
import { DynamicTable } from "../ui/dynamic-table";
import { ConfirmAction } from "../ui/confirm-action";
import useColumns from "./hooks/use-columns";
import { useStaticFilter } from "./hooks/use-static-filter";
import { useDynamicFilter } from "./hooks/use-dynamic-filter";
import { useDeleteInstructorExperienceAction } from "./hooks/use-delete-instructor-experience";
import { useToggleInstructorExperienceActiveAction } from "./hooks/use-toggle-instructor-experience-active";
import {
  getInstructorExperiencesQuery,
  INSTRUCTOR_EXPERIENCES_HREF,
} from "./utils/constants";

/** Instructor experience table. Data is prefetched in the route's page.tsx. */
export default function InstructorExperiencePage() {
  const t = useTranslations();
  const router = useRouter();
  // Viewing, creating and editing happen on their own pages:
  // /dashboard/instructor-experience/view/[id] and /form/[slug].
  const handleCreate = useCallback(() => {
    router.push(`${INSTRUCTOR_EXPERIENCES_HREF}/form/create`);
  }, [router]);
  const handleEdit = useCallback(
    (row: InstructorExperience) => {
      router.push(`${INSTRUCTOR_EXPERIENCES_HREF}/form/${row.id}`);
    },
    [router],
  );
  const handleView = useCallback(
    (row: InstructorExperience) => {
      router.push(`${INSTRUCTOR_EXPERIENCES_HREF}/view/${row.id}`);
    },
    [router],
  );
  // ?search=&page=&limit=&order=&isActive=&skillId= (any combination).
  const searchParams = useSearchParams();
  // Same query as the server prefetch, so the hydrated cache is reused.
  const query = useMemo(
    () => getInstructorExperiencesQuery((name) => searchParams.get(name)),
    [searchParams],
  );
  const { data, isPending, isFetching, isError, refetch } =
    useInstructorExperiences(query);
  const staticFilter = useStaticFilter();
  const dynamicFilter = useDynamicFilter();
  const deleteAction = useDeleteInstructorExperienceAction();
  const toggleAction = useToggleInstructorExperienceActiveAction();
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
        title={t("instructorExperienceTitle")}
        description={t("instructorExperienceDescription")}
        columns={columns}
        data={data?.data}
        getRowId={(row) => String(row.id)}
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
