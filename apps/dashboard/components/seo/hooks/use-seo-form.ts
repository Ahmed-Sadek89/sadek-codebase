"use client";

import { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { showToast, toastApiError } from "@repo/libs/toast";
import {
  useCreateSeo,
  useUpdateSeo,
} from "@repo/hooks/seo";
import type {
  Seo,
  UpdateSeoRequest,
} from "@repo/types/seo";
import {
  createSeoSchema,
  type SeoFormInput,
  type SeoFormValues,
} from "../schema";
import { getDirection } from "../../../i18n/config";
import { deleteFile } from "../../../libs/upload/delete-file";
import { UploadFileError, uploadFile } from "../../../libs/upload/upload-file";
import { UPLOAD_MAX_SIZE } from "../../../libs/upload/upload-types";
import { bytesToMb } from "../../ui/forms/base-upload/utils/file";
import {
  SEO_CLEARABLE_FIELDS,
  SEO_FORM_DEFAULT_VALUES,
} from "../utils/constants";

type UseSeoFormOptions = {
  /** The row being edited; null/undefined creates a new version. */
  seo?: Seo | null;
  /** Runs after a successful save, e.g. to close the dialog. */
  onSuccess?: () => void;
};

export function useSeoForm({
  seo = null,
  onSuccess,
}: UseSeoFormOptions = {}) {
  const t = useTranslations();
  const dir = getDirection(useLocale());
  const schema = useMemo(() => createSeoSchema(t), [t]);
  const form = useForm<SeoFormInput, unknown, SeoFormValues>({
    resolver: zodResolver(schema),
    defaultValues: SEO_FORM_DEFAULT_VALUES,
    mode: "onBlur",
    reValidateMode: "onChange",
  });
  const createSeo = useCreateSeo();
  const updateSeo = useUpdateSeo();

  const onSubmit = form.handleSubmit(async ({ ogImage, ...rest }) => {
    const oldUrl = seo?.ogImage || undefined;
    // The image uploaded by this submit, deleted again if the save fails.
    let newUrl: string | undefined;

    try {
      // 1. A newly picked image is compressed (WebP) and uploaded first.
      if (ogImage instanceof File) {
        newUrl = (await uploadFile(ogImage)).url;
      }
      const imageUrl = ogImage instanceof File ? newUrl : ogImage;

      if (!seo) {
        await createSeo.mutateAsync({ ...rest, ogImage: imageUrl });
        showToast({ status: "success", title: t("seoCreated"), dir });
      } else {
        // Update: a new image replaces the old one; a removed image or an
        // emptied optional text is cleared with null (omitting it would keep it).
        const isReplaced = newUrl !== undefined;
        const isRemoved = !imageUrl && Boolean(oldUrl);
        const data: UpdateSeoRequest = {
          ...rest,
          ogImage: imageUrl ?? (isRemoved ? null : undefined),
        };
        for (const field of SEO_CLEARABLE_FIELDS) {
          if (rest[field] === undefined && seo[field]) data[field] = null;
        }
        await updateSeo.mutateAsync({ id: seo.id, data });
        // 2. The old image is deleted only once the row no longer points to
        // it, so a failed update never leaves a broken image.
        if (isReplaced || isRemoved) await deleteFile(oldUrl);
        showToast({ status: "success", title: t("seoUpdated"), dir });
      }
      onSuccess?.();
    } catch (error) {
      if (error instanceof UploadFileError) {
        // Too large is only known after the server compresses the image.
        form.setError("ogImage", {
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
  });

  return { form, onSubmit, isPending: form.formState.isSubmitting };
}
