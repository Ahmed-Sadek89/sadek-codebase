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

  const onSubmit = form.handleSubmit(async ({ ogImage, favicon, ...rest }) => {
    // Each image field: the picked value, its saved URL, and how to upload it.
    const images = [
      { field: "ogImage", value: ogImage, oldUrl: seo?.ogImage || undefined, variant: "og" },
      { field: "favicon", value: favicon, oldUrl: seo?.favicon || undefined, variant: "icon" },
    ] as const;
    // Images uploaded by this submit, deleted again if the save fails.
    const uploaded: string[] = [];
    let failedField: (typeof images)[number]["field"] = "ogImage";

    try {
      // 1. Newly picked images are uploaded first: the share image becomes a
      // 1200×630 JPEG (no cropping; JPEG, which every link preview reads), the
      // tab icon a 512×512 PNG.
      const urls: Record<(typeof images)[number]["field"], string | undefined> = {
        ogImage: undefined,
        favicon: undefined,
      };
      for (const image of images) {
        failedField = image.field;
        if (image.value instanceof File) {
          const url = (await uploadFile(image.value, { variant: image.variant })).url;
          uploaded.push(url);
          urls[image.field] = url;
        } else {
          urls[image.field] = image.value;
        }
      }

      if (!seo) {
        await createSeo.mutateAsync({ ...rest, ...urls });
        showToast({ status: "success", title: t("seoCreated"), dir });
      } else {
        // Update: a new image replaces the old one; a removed image or an
        // emptied optional text is cleared with null (omitting it would keep it).
        const data: UpdateSeoRequest = { ...rest };
        const replacedUrls: (string | undefined)[] = [];
        for (const image of images) {
          const url = urls[image.field];
          const isReplaced = image.value instanceof File;
          const isRemoved = !url && Boolean(image.oldUrl);
          data[image.field] = url ?? (isRemoved ? null : undefined);
          if (isReplaced || isRemoved) replacedUrls.push(image.oldUrl);
        }
        for (const field of SEO_CLEARABLE_FIELDS) {
          if (rest[field] === undefined && seo[field]) data[field] = null;
        }
        await updateSeo.mutateAsync({ id: seo.id, data });
        // 2. Old images are deleted only once the row no longer points to
        // them, so a failed update never leaves a broken image.
        await Promise.all(replacedUrls.map((url) => deleteFile(url)));
        showToast({ status: "success", title: t("seoUpdated"), dir });
      }
      onSuccess?.();
    } catch (error) {
      if (error instanceof UploadFileError) {
        // Too large is only known after the server processes the image.
        form.setError(failedField, {
          message:
            error.reason === "tooLarge"
              ? t("uploadTooLarge", { size: bytesToMb(UPLOAD_MAX_SIZE) })
              : t("uploadFailed"),
        });
        await Promise.all(uploaded.map((url) => deleteFile(url)));
        return;
      }
      // The save failed: drop the images uploaded for it.
      await Promise.all(uploaded.map((url) => deleteFile(url)));
      toastApiError(error, { dir });
    }
  });

  return { form, onSubmit, isPending: form.formState.isSubmitting };
}
