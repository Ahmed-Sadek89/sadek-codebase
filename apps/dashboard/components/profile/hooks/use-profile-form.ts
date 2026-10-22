"use client";

import { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { useForm, useWatch } from "react-hook-form";
import { showToast, toastApiError } from "@repo/libs/toast";
import { useUpdateUser } from "@repo/hooks/users";
import type { CurrentUser } from "@repo/types/auth";
import { getDirection } from "../../../i18n/config";
import { deleteFile } from "../../../libs/upload/delete-file";
import { UploadFileError, uploadFile } from "../../../libs/upload/upload-file";
import { UPLOAD_MAX_SIZE } from "../../../libs/upload/upload-types";
import { useObjectUrl } from "../../ui/forms/base-upload/hooks/use-object-url";
import type { UploadFieldValue } from "../../ui/forms/base-upload";
import { bytesToMb } from "../../ui/forms/base-upload/utils/file";
import {
  createProfileSchema,
  type ProfileFormInput,
  type ProfileFormValues,
} from "../schema";
import { toProfileFormInput } from "../utils/constants";
import { useSession } from "next-auth/react";

type ImageField = "avatarUrl" | "coverPhotoUrl";
const IMAGE_FIELDS: ImageField[] = ["avatarUrl", "coverPhotoUrl"];

/** An upload that failed, tagged with the field it belongs to. */
class ImageUploadError extends Error {
  constructor(
    readonly field: ImageField,
    readonly upload: UploadFileError,
  ) {
    super(upload.message);
  }
}

type UseProfileFormOptions = {
  /** The signed-in user from GET /auth/me. */
  user: CurrentUser;
  /** Runs after a successful save, e.g. to leave edit mode. */
  onSuccess?: () => void;
};

/** The picked File, if the field holds exactly one. */
const pickedFile = (value: UploadFieldValue) =>
  value instanceof File ? value : null;

export function useProfileForm({ user, onSuccess }: UseProfileFormOptions) {
  const t = useTranslations();
  const dir = getDirection(useLocale());
  const schema = useMemo(() => createProfileSchema(t), [t]);
  const { update } = useSession();
  const form = useForm<ProfileFormInput, unknown, ProfileFormValues>({
    resolver: zodResolver(schema),
    defaultValues: toProfileFormInput(user),
    mode: "onBlur",
    reValidateMode: "onChange",
  });
  const updateUser = useUpdateUser();

  // Live preview: typed text and picked images, before anything is saved.
  const [username, email, avatarUrl, coverPhotoUrl] = useWatch({
    control: form.control,
    name: ["username", "email", "avatarUrl", "coverPhotoUrl"],
  });
  const avatarBlob = useObjectUrl(pickedFile(avatarUrl));
  const coverBlob = useObjectUrl(pickedFile(coverPhotoUrl));
  const preview = {
    username: username.trim(),
    email: email.trim(),
    avatarSrc: avatarBlob ?? (typeof avatarUrl === "string" ? avatarUrl : null),
    coverSrc:
      coverBlob ?? (typeof coverPhotoUrl === "string" ? coverPhotoUrl : null),
  };

  const onSubmit = form.handleSubmit(async (values) => {
    // Images uploaded by this submit, deleted again if the save fails.
    const uploaded: string[] = [];
    // Saved images the user no longer points to, deleted after the save.
    const dropped: string[] = [];
    const images: Partial<Record<ImageField, string | null>> = {};

    try {
      // 1. Newly picked images are compressed (WebP) and uploaded first.
      for (const field of IMAGE_FIELDS) {
        const value = values[field];
        const oldUrl = user[field] || undefined;
        let url: string | undefined;
        if (value instanceof File) {
          try {
            url = (await uploadFile(value)).url;
          } catch (error) {
            if (error instanceof UploadFileError) {
              throw new ImageUploadError(field, error);
            }
            throw error;
          }
          uploaded.push(url);
        } else {
          url = value;
        }

        // Unchanged images are left out; a removed one is cleared with null.
        if (url === oldUrl) continue;
        images[field] = url ?? null;
        if (oldUrl) dropped.push(oldUrl);
      }

      await updateUser.mutateAsync({
        id: user.id,
        data: { username: values.username, email: values.email, ...images },
      });
      // 2. Old images are deleted only once the user no longer points to
      // them, so a failed update never leaves a broken image.
      await Promise.all(dropped.map((url) => deleteFile(url)));
      // 3. Copy the changed username, email, and avatar into the NextAuth
      // session. Best effort: the profile itself is already saved.
      await update({
        user: {
          ...(values.username !== user.username && { name: values.username }),
          ...(values.email !== user.email && { email: values.email }),
          ...(images.avatarUrl !== undefined && { image: images.avatarUrl }),
        },
      }).catch(() => null);
      showToast({ status: "success", title: t("profileUpdated"), dir });
      onSuccess?.();
    } catch (error) {
      // Nothing was saved: drop whatever this submit uploaded.
      await Promise.all(uploaded.map((url) => deleteFile(url)));
      if (error instanceof ImageUploadError) {
        // Too large is only known after the server compresses the image.
        form.setError(error.field, {
          message:
            error.upload.reason === "tooLarge"
              ? t("uploadTooLarge", { size: bytesToMb(UPLOAD_MAX_SIZE) })
              : t("uploadFailed"),
        });
        return;
      }
      toastApiError(error, { dir });
    }
  });

  return {
    form,
    onSubmit,
    preview,
    isPending: form.formState.isSubmitting,
  };
}
