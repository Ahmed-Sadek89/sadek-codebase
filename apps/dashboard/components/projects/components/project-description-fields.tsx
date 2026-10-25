"use client";

import { useTranslations } from "next-intl";
import { Controller } from "react-hook-form";
import { BaseRichTextEditor } from "../../ui/forms/base-rich-text-editor";
import type { ProjectFieldsProps } from "./project-image-field";

/** The English, then the Arabic rich-text description, stacked. */
export function ProjectDescriptionFields({ form, disabled }: ProjectFieldsProps) {
  const t = useTranslations();

  return (
    <>
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
