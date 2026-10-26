"use client";

import { useTranslations } from "next-intl";
import { Controller } from "react-hook-form";
import { BaseRichTextEditor } from "../../ui/forms/base-rich-text-editor";
import type { InstructorExperienceFieldsProps } from "./course-fields";

const FIELDS = [
  {
    name: "descriptionEn",
    dir: "ltr",
    labelKey: "instructorExperienceFormDescriptionEnLabel",
    placeholderKey: "instructorExperienceFormDescriptionEnPlaceholder",
  },
  {
    name: "descriptionAr",
    dir: "rtl",
    labelKey: "instructorExperienceFormDescriptionArLabel",
    placeholderKey: "instructorExperienceFormDescriptionArPlaceholder",
  },
] as const;

/** The English, then the Arabic rich-text description, stacked. */
export function DescriptionFields({ form, disabled }: InstructorExperienceFieldsProps) {
  const t = useTranslations();

  return (
    <>
      {FIELDS.map(({ name, dir, labelKey, placeholderKey }) => (
        <Controller
          key={name}
          control={form.control}
          name={name}
          render={({ field, fieldState }) => (
            <BaseRichTextEditor
              id={name}
              label={t(labelKey)}
              placeholder={t(placeholderKey)}
              dir={dir}
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
      ))}
    </>
  );
}
