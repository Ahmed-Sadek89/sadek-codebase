"use client";

import { useTranslations } from "next-intl";
import { BaseInput } from "../../ui/forms/base-input";
import { BaseTextarea } from "../../ui/forms/base-textarea";
import { PROJECT_NAME_MAX } from "../schema";
import type { ProjectFieldsProps } from "./project-image-field";

/** English/Arabic names, then descriptions; render inside the form's 2-column grid. */
export function ProjectTextFields({ form, disabled }: ProjectFieldsProps) {
  const t = useTranslations();
  const { errors } = form.formState;

  return (
    <>
      <BaseInput
        id="nameEn"
        label={t("projectFormNameEnLabel")}
        placeholder={t("projectFormNameEnPlaceholder")}
        dir="ltr"
        maxLength={PROJECT_NAME_MAX}
        required
        disabled={disabled}
        error={errors.nameEn?.message}
        {...form.register("nameEn")}
      />
      <BaseInput
        id="nameAr"
        label={t("projectFormNameArLabel")}
        placeholder={t("projectFormNameArPlaceholder")}
        dir="rtl"
        maxLength={PROJECT_NAME_MAX}
        required
        disabled={disabled}
        error={errors.nameAr?.message}
        {...form.register("nameAr")}
      />
      <BaseTextarea
        id="descriptionEn"
        label={t("projectFormDescriptionEnLabel")}
        placeholder={t("projectFormDescriptionEnPlaceholder")}
        dir="ltr"
        rows={4}
        required
        disabled={disabled}
        error={errors.descriptionEn?.message}
        {...form.register("descriptionEn")}
      />
      <BaseTextarea
        id="descriptionAr"
        label={t("projectFormDescriptionArLabel")}
        placeholder={t("projectFormDescriptionArPlaceholder")}
        dir="rtl"
        rows={4}
        required
        disabled={disabled}
        error={errors.descriptionAr?.message}
        {...form.register("descriptionAr")}
      />
    </>
  );
}
