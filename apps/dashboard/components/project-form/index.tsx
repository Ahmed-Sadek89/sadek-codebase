"use client";

import { useProject } from "@repo/hooks/projects";
import { isNotFoundError } from "../../utils/api-errors";
import { ProjectForm } from "./components/project-form";
import { ProjectLoadError, ProjectNotFound } from "./components/project-form-states";
import { ProjectFormSkeleton } from "../ui/skeleton/project-form-skeleton";

export default function ProjectFormPage({ projectId }: { projectId: number | null }) {
  if (projectId === null) return <ProjectForm project={null} />;
  return <EditProject id={projectId} />;
}

function EditProject({ id }: { id: number }) {
  const { data, isPending, isError, error, refetch, isFetching } = useProject(id);

  if (isError) {
    return isNotFoundError(error) ? (
      <ProjectNotFound />
    ) : (
      <ProjectLoadError onRetry={() => void refetch()} isRetrying={isFetching} />
    );
  }
  if (isPending) return <ProjectFormSkeleton />;
  return <ProjectForm key={data.id} project={data} />;
}
