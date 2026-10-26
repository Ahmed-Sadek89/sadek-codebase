"use client";

import { useInstructorExperience } from "@repo/hooks/instructor-experience";
import { isNotFoundError } from "../../utils/api-errors";
import { ProjectFormSkeleton } from "../ui/skeleton/project-form-skeleton";
import { InstructorExperienceForm } from "./components/instructor-experience-form";
import {
  InstructorExperienceLoadError,
  InstructorExperienceNotFound,
} from "./components/form-states";

/**
 * /dashboard/instructor-experience/form/[slug]: `id` null creates a row;
 * a number edits that row once it has loaded.
 */
export default function InstructorExperienceFormPage({ id }: { id: number | null }) {
  if (id === null) return <InstructorExperienceForm instructorExperience={null} />;
  return <EditInstructorExperience id={id} />;
}

function EditInstructorExperience({ id }: { id: number }) {
  const { data, isPending, isError, error, refetch, isFetching } =
    useInstructorExperience(id);

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
  return <InstructorExperienceForm key={data.id} instructorExperience={data} />;
}
