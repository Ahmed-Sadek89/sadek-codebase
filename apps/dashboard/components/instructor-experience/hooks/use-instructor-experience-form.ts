"use client";

import { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { showToast, toastApiError } from "@repo/libs/toast";
import {
  useCreateInstructorExperience,
  useUpdateInstructorExperience,
} from "@repo/hooks/instructor-experience";
import type { InstructorExperience } from "@repo/types/instructor-experience";
import {
  createInstructorExperienceSchema,
  type InstructorExperienceFormInput,
  type InstructorExperienceFormValues,
} from "../schema";
import { getDirection } from "../../../i18n/config";
import { deleteFile } from "../../../libs/upload/delete-file";
import { UploadFileError, uploadFile } from "../../../libs/upload/upload-file";
import { UPLOAD_MAX_SIZE } from "../../../libs/upload/upload-types";
import { bytesToMb } from "../../ui/forms/base-upload/utils/file";
import { toInstructorExperienceFormInput } from "../utils/constants";

type UseInstructorExperienceFormOptions = {
  /** The row being edited; null creates a new one. */
  instructorExperience?: InstructorExperience | null;
  /** Runs after a successful save, e.g. to leave the page. */
  onSuccess?: () => void;
};

export function useInstructorExperienceForm({
  instructorExperience = null,
  onSuccess,
}: UseInstructorExperienceFormOptions = {}) {
  const t = useTranslations();
  const dir = getDirection(useLocale());
  const schema = useMemo(() => createInstructorExperienceSchema(t), [t]);
  const form = useForm<
    InstructorExperienceFormInput,
    unknown,
    InstructorExperienceFormValues
  >({
    resolver: zodResolver(schema),
    // The form mounts once the row is loaded, so its values are known here.
    defaultValues: toInstructorExperienceFormInput(instructorExperience),
    mode: "onBlur",
    reValidateMode: "onChange",
  });
  const createRow = useCreateInstructorExperience();
  const updateRow = useUpdateInstructorExperience();

  const onSubmit = form.handleSubmit(async ({ coverPhotoUrl, ...rest }) => {
    const oldUrl = instructorExperience?.coverPhotoUrl || undefined;
    // The photo uploaded by this submit, deleted again if the save fails.
    let newUrl: string | undefined;

    try {
      // 1. A newly picked photo is compressed (WebP) and uploaded first.
      if (coverPhotoUrl instanceof File) {
        newUrl = (await uploadFile(coverPhotoUrl)).url;
      }
      const photoUrl = coverPhotoUrl instanceof File ? newUrl : coverPhotoUrl;

      if (!instructorExperience) {
        await createRow.mutateAsync({ ...rest, coverPhotoUrl: photoUrl });
        showToast({ status: "success", title: t("instructorExperienceCreated"), dir });
      } else {
        // A new photo replaces the old one; a removed photo is cleared with
        // null (omitting it would keep it).
        const isReplaced = newUrl !== undefined;
        const isRemoved = !photoUrl && Boolean(oldUrl);
        await updateRow.mutateAsync({
          id: instructorExperience.id,
          data: {
            ...rest,
            coverPhotoUrl: photoUrl ?? (isRemoved ? null : undefined),
          },
        });
        // 2. The old photo is deleted only once the row no longer points to it.
        if (isReplaced || isRemoved) await deleteFile(oldUrl);
        showToast({ status: "success", title: t("instructorExperienceUpdated"), dir });
      }
      onSuccess?.();
    } catch (error) {
      if (error instanceof UploadFileError) {
        // Too large is only known after the server compresses the image.
        form.setError("coverPhotoUrl", {
          message:
            error.reason === "tooLarge"
              ? t("uploadTooLarge", { size: bytesToMb(UPLOAD_MAX_SIZE) })
              : t("uploadFailed"),
        });
        return;
      }
      // The save failed: drop the photo uploaded for it.
      await deleteFile(newUrl);
      toastApiError(error, { dir });
    }
  });

  return { form, onSubmit, isPending: form.formState.isSubmitting };
}
