"use client";

import { useTranslations } from "next-intl";
import { Controller, type UseFormReturn } from "react-hook-form";
import { BaseUpload } from "../../ui/forms/base-upload";
import type { ProjectFormInput, ProjectFormValues } from "../schema";

/** Props every project form field group takes. */
export type ProjectFieldsProps = {
  form: UseFormReturn<ProjectFormInput, unknown, ProjectFormValues>;
  disabled: boolean;
};

/** The main image (picked here, uploaded on submit). */
export function ProjectImageField({ form, disabled }: ProjectFieldsProps) {
  const t = useTranslations();

  return (
    <Controller
      control={form.control}
      name="mainImageUrl"
      render={({ field, fieldState }) => (
        <BaseUpload
          id={field.name}
          label={t("projectFormImageLabel")}
          uploadType="image"
          value={field.value}
          onChange={field.onChange}
          onBlur={field.onBlur}
          validate={() => form.trigger("mainImageUrl")}
          disabled={disabled}
          error={fieldState.error?.message}
        />
      )}
    />
  );
}
