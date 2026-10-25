"use client";

import { useTranslations } from "next-intl";
import type { UseFormReturn } from "react-hook-form";
import { BaseInput } from "../../ui/forms/base-input";
import { BaseTextarea } from "../../ui/forms/base-textarea";
import {
  USER_COMPANY_NAME_MAX,
  type UserCompanyFormInput,
  type UserCompanyFormValues,
} from "../schema";

export type UserCompanyFieldsProps = {
  form: UseFormReturn<UserCompanyFormInput, unknown, UserCompanyFormValues>;
  disabled: boolean;
};

/** Company name (full row) and the English/Arabic descriptions; render inside the form's 2-column grid. */
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
        className="sm:col-span-2"
        maxLength={USER_COMPANY_NAME_MAX}
        required
        disabled={disabled}
        error={errors.company_name?.message}
        {...form.register("company_name")}
      />
      <BaseTextarea
        id="description_en"
        label={t("userCompanyFormDescriptionEnLabel")}
        placeholder={t("userCompanyFormDescriptionEnPlaceholder")}
        dir="ltr"
        rows={4}
        disabled={disabled}
        error={errors.description_en?.message}
        {...form.register("description_en")}
      />
      <BaseTextarea
        id="description_ar"
        label={t("userCompanyFormDescriptionArLabel")}
        placeholder={t("userCompanyFormDescriptionArPlaceholder")}
        dir="rtl"
        rows={4}
        disabled={disabled}
        error={errors.description_ar?.message}
        {...form.register("description_ar")}
      />
    </>
  );
}
