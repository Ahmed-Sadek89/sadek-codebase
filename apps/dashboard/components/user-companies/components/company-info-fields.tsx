"use client";

import { useTranslations } from "next-intl";
import type { UseFormReturn } from "react-hook-form";
import { BaseInput } from "../../ui/forms/base-input";
import {
  USER_COMPANY_NAME_MAX,
  USER_COMPANY_URL_MAX,
  type UserCompanyFormInput,
  type UserCompanyFormValues,
} from "../schema";

export type UserCompanyFieldsProps = {
  form: UseFormReturn<UserCompanyFormInput, unknown, UserCompanyFormValues>;
  disabled: boolean;
};

/** Company name and website side by side; render inside the form's 2-column grid. */
export function CompanyInfoFields({ form, disabled }: UserCompanyFieldsProps) {
  const t = useTranslations();
  const { errors } = form.formState;

  return (
    <>
      <BaseInput
        id="company_name"
        label={t("userCompanyFormCompanyNameLabel")}
        placeholder={t("userCompanyFormCompanyNamePlaceholder")}
        dir="auto"
        maxLength={USER_COMPANY_NAME_MAX}
        required
        disabled={disabled}
        error={errors.company_name?.message}
        {...form.register("company_name")}
      />
      <BaseInput
        id="company_site"
        type="url"
        inputMode="url"
        label={t("userCompanyFormSiteLabel")}
        placeholder="https://"
        dir="ltr"
        maxLength={USER_COMPANY_URL_MAX}
        disabled={disabled}
        error={errors.company_site?.message}
        {...form.register("company_site")}
      />
    </>
  );
}
