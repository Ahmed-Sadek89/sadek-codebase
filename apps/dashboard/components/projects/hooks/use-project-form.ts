"use client";

import { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { showToast, toastApiError } from "@repo/libs/toast";
import { useCreateProject, useUpdateProject } from "@repo/hooks/projects";
import type { Project } from "@repo/types/projects";
import {
  createProjectSchema,
  type ProjectFormInput,
  type ProjectFormValues,
} from "../schema";
import { getDirection } from "../../../i18n/config";
import { deleteFile } from "../../../libs/upload/delete-file";
import { UploadFileError, uploadFile } from "../../../libs/upload/upload-file";
import { UPLOAD_MAX_SIZE } from "../../../libs/upload/upload-types";
import { bytesToMb } from "../../ui/forms/base-upload/utils/file";
import { PROJECT_FORM_DEFAULT_VALUES } from "../utils/constants";

type UseProjectFormOptions = {
  /** The row being edited; null/undefined creates a new project. */
  project?: Project | null;
  /** Runs after a successful save, e.g. to close the dialog. */
  onSuccess?: () => void;
};

export function useProjectForm({
  project = null,
  onSuccess,
}: UseProjectFormOptions = {}) {
  const t = useTranslations();
  const dir = getDirection(useLocale());
  const schema = useMemo(() => createProjectSchema(t), [t]);
  const form = useForm<ProjectFormInput, unknown, ProjectFormValues>({
    resolver: zodResolver(schema),
    defaultValues: PROJECT_FORM_DEFAULT_VALUES,
    mode: "onBlur",
    reValidateMode: "onChange",
  });
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();

  const onSubmit = form.handleSubmit(
    async ({ mainImageUrl, liveUrl, repoUrl, ...rest }) => {
      const oldUrl = project?.mainImageUrl || undefined;
      // The image uploaded by this submit, deleted again if the save fails.
      let newUrl: string | undefined;

      try {
        // 1. A newly picked image is compressed (WebP) and uploaded first.
        if (mainImageUrl instanceof File) {
          newUrl = (await uploadFile(mainImageUrl)).url;
        }
        const imageUrl = mainImageUrl instanceof File ? newUrl : mainImageUrl;

        if (!project) {
          // Create: the uploaded image (if any) goes into the new project.
          await createProject.mutateAsync({
            ...rest,
            mainImageUrl: imageUrl,
            liveUrl,
            repoUrl,
          });
          showToast({ status: "success", title: t("projectCreated"), dir });
        } else {
          // Update: a new image replaces the old one; a removed image or an
          // emptied link is cleared with null (omitting it would keep it).
          const isReplaced = newUrl !== undefined;
          const isRemoved = !imageUrl && Boolean(oldUrl);
          await updateProject.mutateAsync({
            id: project.id,
            data: {
              ...rest,
              mainImageUrl: imageUrl ?? (isRemoved ? null : undefined),
              liveUrl: liveUrl ?? (project.liveUrl ? null : undefined),
              repoUrl: repoUrl ?? (project.repoUrl ? null : undefined),
            },
          });
          // 2. The old image is deleted only once the project no longer points
          // to it, so a failed update never leaves a broken image.
          if (isReplaced || isRemoved) await deleteFile(oldUrl);
          showToast({ status: "success", title: t("projectUpdated"), dir });
        }
        onSuccess?.();
      } catch (error) {
        if (error instanceof UploadFileError) {
          // Too large is only known after the server compresses the image.
          form.setError("mainImageUrl", {
            message:
              error.reason === "tooLarge"
                ? t("uploadTooLarge", { size: bytesToMb(UPLOAD_MAX_SIZE) })
                : t("uploadFailed"),
          });
          return;
        }
        // The save failed: drop the image uploaded for it.
        await deleteFile(newUrl);
        toastApiError(error, { dir });
      }
    },
  );

  return { form, onSubmit, isPending: form.formState.isSubmitting };
}
