"use client";

import { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { showToast, toastApiError } from "@repo/libs/toast";
import {
  useCreateUserCompany,
  useUpdateUserCompany,
} from "@repo/hooks/user-company";
import type { UserCompanyDetails } from "@repo/types/user-company";
import {
  createUserCompanySchema,
  type UserCompanyFormInput,
  type UserCompanyFormValues,
} from "../schema";
import { getDirection } from "../../../i18n/config";
import { deleteFile } from "../../../libs/upload/delete-file";
import { UploadFileError, uploadFile } from "../../../libs/upload/upload-file";
import { UPLOAD_MAX_SIZE } from "../../../libs/upload/upload-types";
import { bytesToMb } from "../../ui/forms/base-upload/utils/file";
import { USER_COMPANY_FORM_DEFAULT_VALUES } from "../utils/constants";

type UseUserCompanyFormOptions = {
  /** The row being edited; null/undefined creates a new company. */
  company?: UserCompanyDetails | null;
  /** Runs after a successful save, e.g. to close the dialog. */
  onSuccess?: () => void;
};

export function useUserCompanyForm({
  company = null,
  onSuccess,
}: UseUserCompanyFormOptions = {}) {
  const t = useTranslations();
  const dir = getDirection(useLocale());
  const schema = useMemo(() => createUserCompanySchema(t), [t]);
  const form = useForm<UserCompanyFormInput, unknown, UserCompanyFormValues>({
    resolver: zodResolver(schema),
    defaultValues: USER_COMPANY_FORM_DEFAULT_VALUES,
    mode: "onBlur",
    reValidateMode: "onChange",
  });
  const createUserCompany = useCreateUserCompany();
  const updateUserCompany = useUpdateUserCompany();

  const onSubmit = form.handleSubmit(async ({ logo, ...rest }) => {
    const oldUrl = company?.logo || undefined;
    // The logo uploaded by this submit, deleted again if the save fails.
    let newUrl: string | undefined;

    try {
      // 1. A newly picked logo is compressed (WebP) and uploaded first.
      if (logo instanceof File) {
        newUrl = (await uploadFile(logo)).url;
      }
      const logoUrl = logo instanceof File ? newUrl : logo;

      if (!company) {
        await createUserCompany.mutateAsync({ ...rest, logo: logoUrl });
        showToast({ status: "success", title: t("userCompanyCreated"), dir });
      } else {
        // Update: an emptied optional field is cleared with null (omitting
        // it would keep the saved value); no end date marks a current job.
        const isReplaced = newUrl !== undefined;
        const isRemoved = !logoUrl && Boolean(oldUrl);
        const clear = (value: string | undefined, saved: string | null) =>
          value ?? (saved ? null : undefined);
        await updateUserCompany.mutateAsync({
          id: company.id,
          data: {
            ...rest,
            name_ar: clear(rest.name_ar, company.name_ar),
            description_en: clear(rest.description_en, company.description_en),
            description_ar: clear(rest.description_ar, company.description_ar),
            startWorkTo: clear(rest.startWorkTo, company.startWorkTo),
            company_site: clear(rest.company_site, company.company_site),
            logo: logoUrl ?? (isRemoved ? null : undefined),
          },
        });
        // 2. The old logo is deleted only once the row no longer points to it.
        if (isReplaced || isRemoved) await deleteFile(oldUrl);
        showToast({ status: "success", title: t("userCompanyUpdated"), dir });
      }
      onSuccess?.();
    } catch (error) {
      if (error instanceof UploadFileError) {
        // Too large is only known after the server compresses the image.
        form.setError("logo", {
          message:
            error.reason === "tooLarge"
              ? t("uploadTooLarge", { size: bytesToMb(UPLOAD_MAX_SIZE) })
              : t("uploadFailed"),
        });
        return;
      }
      // The save failed: drop the logo uploaded for it.
      await deleteFile(newUrl);
      toastApiError(error, { dir });
    }
  });

  return { form, onSubmit, isPending: form.formState.isSubmitting };
}
