"use client";

import { useState } from "react";
import { useProject } from "@repo/hooks/projects";
import { ConfirmAction } from "../ui/confirm-action";
import { useRouter } from "../../i18n/navigation";
import { isNotFoundError } from "../../utils/api-errors";
import { useDeleteProjectAction } from "../projects/hooks/use-delete-project";
import { useToggleProjectActiveAction } from "../projects/hooks/use-toggle-project-active";
import { ProjectFormSkeleton } from "../ui/skeleton/project-form-skeleton";
import {
  ProjectLoadError,
  ProjectNotFound,
} from "../project-form/components/project-form-states";
import { ProjectContent } from "./components/project-content";
import { ProjectSidePanel } from "./components/project-side-panel";
import { ViewHeader } from "./components/view-header";

/**
 * /dashboard/projects/view/[id]: every field of one project, with Make live /
 * Take offline, Edit and Delete. Prefetched in the route's page.tsx.
 */
export default function ProjectViewPage({ id }: { id: number }) {
  const router = useRouter();
  const { data: project, isPending, isError, error, refetch, isFetching } =
    useProject(id);
  const toggleAction = useToggleProjectActiveAction();
  // Set once deleted: the cached project is gone, so don't flash "not found" while leaving.
  const [isLeaving, setIsLeaving] = useState(false);
  const deleteAction = useDeleteProjectAction({
    onDeleted: () => {
      setIsLeaving(true);
      router.replace("/dashboard/projects");
    },
  });

  if (isLeaving) return <ProjectFormSkeleton />;

  if (isError) {
    return isNotFoundError(error) ? (
      <ProjectNotFound />
    ) : (
      <ProjectLoadError onRetry={() => void refetch()} isRetrying={isFetching} />
    );
  }
  if (isPending) return <ProjectFormSkeleton />;

  return (
    <main className="space-y-6">
      <ViewHeader
        project={project}
        busy={toggleAction.isToggling || deleteAction.isDeleting}
        onToggleActive={() => toggleAction.requestToggle(project)}
        onDelete={() => deleteAction.requestDelete(project)}
      />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <ProjectContent project={project} />
        <ProjectSidePanel project={project} />
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
