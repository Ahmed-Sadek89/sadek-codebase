"use client";

import { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm, useWatch } from "react-hook-form";
import type { CurrentUser } from "@repo/types/auth";
import { useObjectUrl } from "../../ui/forms/base-upload/hooks/use-object-url";
import type { UploadFieldValue } from "../../ui/forms/base-upload";
import {
  createProfileSchema,
  type ProfileFormInput,
  type ProfileFormValues,
} from "../schema";
import { toProfileFormInput } from "../utils/constants";

type UseProfileFormOptions = {
  /** The signed-in user from GET /auth/me. */
  user: CurrentUser;
};

/** The picked File, if the field holds exactly one. */
const pickedFile = (value: UploadFieldValue) =>
  value instanceof File ? value : null;

export function useProfileForm({ user }: UseProfileFormOptions) {
  const t = useTranslations();
  const schema = useMemo(() => createProfileSchema(t), [t]);
  const form = useForm<ProfileFormInput, unknown, ProfileFormValues>({
    resolver: zodResolver(schema),
    defaultValues: toProfileFormInput(user),
    mode: "onBlur",
    reValidateMode: "onChange",
  });

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

  // No update endpoint is wired yet: the validated values are only logged.
  const onSubmit = form.handleSubmit((values) => {
    console.log("[profile] submit", values);
  });

  return {
    form,
    onSubmit,
    preview,
    isPending: form.formState.isSubmitting,
  };
}
