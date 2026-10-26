"use client";

import { useTranslations } from "next-intl";
import { Controller, useWatch } from "react-hook-form";
import { BaseDatePicker } from "../../ui/forms/base-date-picker";
import type { InstructorExperienceFieldsProps } from "./course-fields";

/** Start and end dates (end on or after start); render inside a 2-column grid. */
export function PeriodFields({ form, disabled }: InstructorExperienceFieldsProps) {
  const t = useTranslations();
  const startAt = useWatch({ control: form.control, name: "startAt" });

  return (
    <>
      <Controller
        control={form.control}
        name="startAt"
        render={({ field, fieldState }) => (
          <BaseDatePicker
            id={field.name}
            label={t("instructorExperienceFormStartLabel")}
            value={field.value}
            onChange={(value) => {
              field.onChange(value);
              // Re-check the end date against the new start.
              if (form.getValues("endAt")) void form.trigger("endAt");
            }}
            onBlur={field.onBlur}
            required
            disabled={disabled}
            error={fieldState.error?.message}
          />
        )}
      />
      <Controller
        control={form.control}
        name="endAt"
        render={({ field, fieldState }) => (
          <BaseDatePicker
            id={field.name}
            label={t("instructorExperienceFormEndLabel")}
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            min={startAt || undefined}
            required
            disabled={disabled}
            error={fieldState.error?.message}
          />
        )}
      />
    </>
  );
}
