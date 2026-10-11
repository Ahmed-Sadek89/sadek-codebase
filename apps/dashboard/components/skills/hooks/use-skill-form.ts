"use client";

import { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { showToast, toastApiError } from "@repo/libs/toast";
import { useCreateSkill, useUpdateSkill } from "@repo/hooks/skills";
import type { Skill } from "@repo/types/skills";
import { createSkillSchema, type SkillFormInput, type SkillFormValues } from "../schema";
import { getDirection } from "../../../i18n/config";
import { deleteFile } from "../../../libs/upload/delete-file";
import { UploadFileError, uploadFile } from "../../../libs/upload/upload-file";
import { UPLOAD_MAX_SIZE } from "../../../libs/upload/upload-types";
import { bytesToMb } from "../../ui/forms/base-upload/utils/file";
import { SKILL_FORM_DEFAULT_VALUES } from "../utils/constants";

type UseSkillFormOptions = {
  /** The row being edited; null/undefined creates a new skill. */
  skill?: Skill | null;
  /** Runs after a successful save, e.g. to close the dialog. */
  onSuccess?: () => void;
};

export function useSkillForm({ skill = null, onSuccess }: UseSkillFormOptions = {}) {
  const t = useTranslations();
  const dir = getDirection(useLocale());
  const schema = useMemo(() => createSkillSchema(t), [t]);
  const form = useForm<SkillFormInput, unknown, SkillFormValues>({
    resolver: zodResolver(schema),
    defaultValues: SKILL_FORM_DEFAULT_VALUES,
    mode: "onBlur",
    reValidateMode: "onChange",
  });
  const createSkill = useCreateSkill();
  const updateSkill = useUpdateSkill();

  const onSubmit = form.handleSubmit(async ({ avatar_url, ...rest }) => {
    const oldUrl = skill?.avatar_url || undefined;
    // The icon uploaded by this submit, deleted again if the save fails.
    let newUrl: string | undefined;

    try {
      // 1. A newly picked icon is compressed (WebP) and uploaded first.
      if (avatar_url instanceof File) newUrl = (await uploadFile(avatar_url)).url;
      const iconUrl = avatar_url instanceof File ? newUrl : avatar_url;

      if (!skill) {
        // Create: the uploaded icon (if any) goes into the new skill.
        await createSkill.mutateAsync({ ...rest, avatar_url: iconUrl });
        showToast({ status: "success", title: t("skillCreated"), dir });
      } else {
        // Update: a new icon replaces the old one; a removed icon is cleared
        // with null (omitting it would keep the old one).
        const isReplaced = newUrl !== undefined;
        const isRemoved = !iconUrl && Boolean(oldUrl);
        await updateSkill.mutateAsync({
          id: skill.id,
          data: { ...rest, avatar_url: iconUrl ?? (isRemoved ? null : undefined) },
        });
        // 2. The old icon is deleted only once the skill no longer points to
        // it, so a failed update never leaves the skill with a broken image.
        if (isReplaced || isRemoved) await deleteFile(oldUrl);
        showToast({ status: "success", title: t("skillUpdated"), dir });
      }
      onSuccess?.();
    } catch (error) {
      if (error instanceof UploadFileError) {
        // Too large is only known after the server compresses the image.
        form.setError("avatar_url", {
          message:
            error.reason === "tooLarge"
              ? t("uploadTooLarge", { size: bytesToMb(UPLOAD_MAX_SIZE) })
              : t("uploadFailed"),
        });
        return;
      }
      // The save failed: drop the icon uploaded for it.
      await deleteFile(newUrl);
      toastApiError(error, { dir });
    }
  });

  return { form, onSubmit, isPending: form.formState.isSubmitting };
}
