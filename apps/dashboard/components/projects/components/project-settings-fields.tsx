"use client";

import { useTranslations } from "next-intl";
import { Controller } from "react-hook-form";
import { Eye } from "@repo/ui/icons";
import { BaseSwitch } from "../../ui/forms/base-switch";
import { MultiSelectCategoryProjects } from "../../ui/forms/base-multi-select/multi-select-category-projects";
import type { ProjectFieldsProps } from "./project-image-field";

/** The categories and the active switch, side by side. */
export function ProjectSettingsFields({ form, disabled }: ProjectFieldsProps) {
  const t = useTranslations();

  return (
    <div className="grid items-end gap-4 sm:grid-cols-2">
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
    </div>
  );
}
