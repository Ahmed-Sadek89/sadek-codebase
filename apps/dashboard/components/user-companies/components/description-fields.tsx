"use client";

import { useTranslations } from "next-intl";
import { BaseTextarea } from "../../ui/forms/base-textarea";
import type { UserCompanyFieldsProps } from "./company-info-fields";

/** The English/Arabic descriptions side by side; render inside the form's 2-column grid. */
export function DescriptionFields({ form, disabled }: UserCompanyFieldsProps) {
  const t = useTranslations();
  const { errors } = form.formState;

  return (
    <>
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
