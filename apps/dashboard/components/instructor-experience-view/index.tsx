"use client";

import { useState } from "react";
import { useInstructorExperience } from "@repo/hooks/instructor-experience";
import { ConfirmAction } from "../ui/confirm-action";
import { useRouter } from "../../i18n/navigation";
import { isNotFoundError } from "../../utils/api-errors";
import { ProjectFormSkeleton } from "../ui/skeleton/project-form-skeleton";
import { useDeleteInstructorExperienceAction } from "../instructor-experience/hooks/use-delete-instructor-experience";
import { useToggleInstructorExperienceActiveAction } from "../instructor-experience/hooks/use-toggle-instructor-experience-active";
import { INSTRUCTOR_EXPERIENCES_HREF } from "../instructor-experience/utils/constants";
import {
  InstructorExperienceLoadError,
  InstructorExperienceNotFound,
} from "../instructor-experience-form/components/form-states";
import { ViewContent } from "./components/view-content";
import { ViewHeader } from "./components/view-header";
import { ViewSidePanel } from "./components/view-side-panel";

/**
 * /dashboard/instructor-experience/view/[id]: every field of one row, with
 * Make live / Take offline, Edit and Delete. Prefetched in the route's page.tsx.
 */
export default function InstructorExperienceViewPage({ id }: { id: number }) {
  const router = useRouter();
  const { data, isPending, isError, error, refetch, isFetching } =
    useInstructorExperience(id);
  const toggleAction = useToggleInstructorExperienceActiveAction();
  // Set once deleted: the cached row is gone, so don't flash "not found" while leaving.
  const [isLeaving, setIsLeaving] = useState(false);
  const deleteAction = useDeleteInstructorExperienceAction({
    onDeleted: () => {
      setIsLeaving(true);
      router.replace(INSTRUCTOR_EXPERIENCES_HREF);
    },
  });

  if (isLeaving) return <ProjectFormSkeleton />;

  if (isError) {
    return isNotFoundError(error) ? (
      <InstructorExperienceNotFound />
    ) : (
      <InstructorExperienceLoadError
        onRetry={() => void refetch()}
        isRetrying={isFetching}
      />
    );
  }
  if (isPending) return <ProjectFormSkeleton />;

  return (
    <main className="space-y-6">
      <ViewHeader
        instructorExperience={data}
        busy={toggleAction.isToggling || deleteAction.isDeleting}
        onToggleActive={() => toggleAction.requestToggle(data)}
        onDelete={() => deleteAction.requestDelete(data)}
      />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <ViewContent instructorExperience={data} />
        <ViewSidePanel instructorExperience={data} />
      </div>
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
