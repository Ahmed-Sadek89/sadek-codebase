"use client";

import { useTranslations } from "next-intl";
import { Controller } from "react-hook-form";
import { BaseInput } from "../../ui/forms/base-input";
import { BaseTextarea } from "../../ui/forms/base-textarea";
import { BaseRichTextEditor } from "../../ui/forms/base-rich-text-editor";
import { PROJECT_NAME_MAX, PROJECT_SHORT_DESCRIPTION_MAX } from "../schema";
import type { ProjectFieldsProps } from "./project-image-field";

/** English/Arabic names, short descriptions, then full-width rich-text descriptions; render inside the form's 2-column grid. */
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
        id="shortDescriptionEn"
        label={t("projectFormShortDescriptionEnLabel")}
        placeholder={t("projectFormShortDescriptionEnPlaceholder")}
        dir="ltr"
        rows={2}
        maxLength={PROJECT_SHORT_DESCRIPTION_MAX}
        required
        disabled={disabled}
        error={errors.shortDescriptionEn?.message}
        {...form.register("shortDescriptionEn")}
      />
      <BaseTextarea
        id="shortDescriptionAr"
        label={t("projectFormShortDescriptionArLabel")}
        placeholder={t("projectFormShortDescriptionArPlaceholder")}
        dir="rtl"
        rows={2}
        maxLength={PROJECT_SHORT_DESCRIPTION_MAX}
        required
        disabled={disabled}
        error={errors.shortDescriptionAr?.message}
        {...form.register("shortDescriptionAr")}
      />
      <Controller
        control={form.control}
        name="descriptionEn"
        render={({ field, fieldState }) => (
          <BaseRichTextEditor
            id="descriptionEn"
            label={t("projectFormDescriptionEnLabel")}
            placeholder={t("projectFormDescriptionEnPlaceholder")}
            dir="ltr"
            required
            disabled={disabled}
            containerClassName="sm:col-span-2"
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            ref={field.ref}
            error={fieldState.error?.message}
          />
        )}
      />
      <Controller
        control={form.control}
        name="descriptionAr"
        render={({ field, fieldState }) => (
          <BaseRichTextEditor
            id="descriptionAr"
            label={t("projectFormDescriptionArLabel")}
            placeholder={t("projectFormDescriptionArPlaceholder")}
            dir="rtl"
            required
            disabled={disabled}
            containerClassName="sm:col-span-2"
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            ref={field.ref}
            error={fieldState.error?.message}
          />
        )}
      />
    </>
  );
}
