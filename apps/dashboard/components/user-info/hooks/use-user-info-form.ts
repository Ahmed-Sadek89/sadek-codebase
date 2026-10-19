"use client";

import { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { showToast, toastApiError } from "@repo/libs/toast";
import { useCreateUserInfo, useUpdateUserInfo } from "@repo/hooks/user-info";
import type { UserInfoDetails } from "@repo/types/user-info";
import {
  createUserInfoSchema,
  type CvSource,
  type UserInfoFormInput,
  type UserInfoFormValues,
} from "../schema";
import { getDirection } from "../../../i18n/config";
import { deleteFile } from "../../../libs/upload/delete-file";
import { UploadFileError, uploadFile } from "../../../libs/upload/upload-file";
import { UPLOAD_MAX_SIZE } from "../../../libs/upload/upload-types";
import { bytesToMb } from "../../ui/forms/base-upload/utils/file";
import { toCvFields, toUserInfoFormInput } from "../utils/constants";

/** A blank optional field: null clears a saved value, undefined leaves it unset. */
const orClear = (value: string | undefined, saved: string | null) =>
  value ?? (saved ? null : undefined);

type UseUserInfoFormOptions = {
  /** The saved row; null creates the user's first row. */
  userInfo: UserInfoDetails | null;
  /** Runs after a successful save, e.g. to leave edit mode. */
  onSuccess?: () => void;
};

export function useUserInfoForm({
  userInfo,
  onSuccess,
}: UseUserInfoFormOptions) {
  const t = useTranslations();
  const dir = getDirection(useLocale());
  const schema = useMemo(() => createUserInfoSchema(t), [t]);
  const form = useForm<UserInfoFormInput, unknown, UserInfoFormValues>({
    resolver: zodResolver(schema),
    defaultValues: toUserInfoFormInput(userInfo),
    mode: "onBlur",
    reValidateMode: "onChange",
  });
  const createUserInfo = useCreateUserInfo();
  const updateUserInfo = useUpdateUserInfo();

  const onSubmit = form.handleSubmit(
    async ({
      cv,
      gmail,
      linkedin,
      github,
      headTitle_ar,
      shortDescription_ar,
      description_ar,
      ...rest
    }) => {
      const oldUrl = userInfo?.cv || undefined;
      // The CV uploaded by this submit, deleted again if the save fails.
      let newUrl: string | undefined;

      try {
        // 1. A newly picked CV is uploaded first (documents are stored as-is).
        if (cv instanceof File) newUrl = (await uploadFile(cv)).url;
        const cvUrl = cv instanceof File ? newUrl : cv;

        if (!userInfo) {
          await createUserInfo.mutateAsync({
            ...rest,
            headTitle_ar,
            shortDescription_ar,
            description_ar,
            gmail,
            linkedin,
            github,
            cv: cvUrl,
          });
          showToast({ status: "success", title: t("userInfoCreated"), dir });
        } else {
          // A removed CV, an emptied link, or an emptied Arabic text is cleared
          // with null (omitting it would keep the saved value).
          // Replaced by an upload or a Drive link, or removed.
          const isOldCvDropped = Boolean(oldUrl) && cvUrl !== oldUrl;
          await updateUserInfo.mutateAsync({
            id: userInfo.id,
            data: {
              ...rest,
              headTitle_ar: orClear(headTitle_ar, userInfo.headTitle_ar),
              shortDescription_ar: orClear(
                shortDescription_ar,
                userInfo.shortDescription_ar,
              ),
              description_ar: orClear(description_ar, userInfo.description_ar),
              gmail: orClear(gmail, userInfo.gmail),
              linkedin: orClear(linkedin, userInfo.linkedin),
              github: orClear(github, userInfo.github),
              cv: cvUrl ?? (oldUrl ? null : undefined),
            },
          });
          // 2. The old CV is deleted only once the row no longer points to it
          // (deleteFile ignores links that are not our uploads, e.g. Drive).
          if (isOldCvDropped) await deleteFile(oldUrl);
          showToast({ status: "success", title: t("userInfoUpdated"), dir });
        }
        onSuccess?.();
      } catch (error) {
        if (error instanceof UploadFileError) {
          form.setError("cv", {
            message:
              error.reason === "tooLarge"
                ? t("uploadTooLarge", { size: bytesToMb(UPLOAD_MAX_SIZE) })
                : t("uploadFailed"),
          });
          return;
        }
        // The save failed: drop the CV uploaded for it.
        await deleteFile(newUrl);
        toastApiError(error, { dir });
      }
    },
  );

  /**
   * Switches between uploading a CV and linking one. Each side gets back its
   * saved value, so switching back undoes the switch; the other side is
   * emptied, since only the active one is submitted.
   */
  const setCvSource = (source: CvSource) => {
    if (form.getValues("cvSource") === source) return;
    const saved = toCvFields(userInfo?.cv);
    form.setValue("cvSource", source, { shouldDirty: true });
    form.setValue("cv", source === "upload" ? saved.cv : "");
    form.setValue("cvLink", source === "link" ? saved.cvLink : "");
    form.clearErrors(["cv", "cvLink"]);
  };

  return {
    form,
    onSubmit,
    setCvSource,
    isPending: form.formState.isSubmitting,
  };
}
