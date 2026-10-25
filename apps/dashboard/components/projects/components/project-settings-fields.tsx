"use client";

import { useTranslations } from "next-intl";
import { Controller } from "react-hook-form";
import { Eye } from "@repo/ui/icons";
import { BaseInput } from "../../ui/forms/base-input";
import { BaseSwitch } from "../../ui/forms/base-switch";
import { PROJECT_RANK_MIN } from "../schema";
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

/** The display order on the website (lowest first). */
export function ProjectRankField({ form, disabled }: ProjectFieldsProps) {
  const t = useTranslations();

  return (
    <BaseInput
      id="rank"
      type="number"
      inputMode="numeric"
      min={PROJECT_RANK_MIN}
      step={1}
      label={t("projectFormRankLabel")}
      description={t("projectFormRankHint")}
      dir="ltr"
      required
      disabled={disabled}
      error={form.formState.errors.rank?.message}
      {...form.register("rank")}
    />
  );
}
