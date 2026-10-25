"use client";

import { useTranslations } from "next-intl";
import { Controller } from "react-hook-form";
import { Eye } from "@repo/ui/icons";
import { BaseSwitch } from "../../ui/forms/base-switch";
import { MultiSelectCategoryProjects } from "../../ui/forms/base-multi-select/multi-select-category-projects";
import type { ProjectFieldsProps } from "./project-image-field";

/** The project's categories (at least one). */
export function ProjectCategoriesField({ form, disabled }: ProjectFieldsProps) {
  return (
    <Controller
      control={form.control}
      name="categoryProjects"
      render={({ field, fieldState }) => (
        <MultiSelectCategoryProjects
          id={field.name}
          value={field.value}
          onChange={field.onChange}
          onBlur={field.onBlur}
          disabled={disabled}
          error={fieldState.error?.message}
        />
      )}
    />
  );
}

/** Whether the project is shown on the website. */
export function ProjectActiveField({ form, disabled }: ProjectFieldsProps) {
  const t = useTranslations();

  return (
    <Controller
      control={form.control}
      name="isActive"
      render={({ field, fieldState }) => (
        <BaseSwitch
          id={field.name}
          label={t("projectFormActiveLabel")}
          description={t("projectFormActiveHint")}
          icon={<Eye className="size-4" />}
          checkedText={t("categorySkillFormActiveOn")}
          uncheckedText={t("categorySkillFormActiveOff")}
          checked={field.value}
          onCheckedChange={field.onChange}
          onBlur={field.onBlur}
          ref={field.ref}
          disabled={disabled}
          error={fieldState.error?.message}
        />
      )}
    />
  );
}
