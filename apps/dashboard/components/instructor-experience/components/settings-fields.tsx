"use client";

import { useTranslations } from "next-intl";
import { Controller } from "react-hook-form";
import { Eye } from "@repo/ui/icons";
import { BaseInput } from "../../ui/forms/base-input";
import { BaseSwitch } from "../../ui/forms/base-switch";
import { BaseUpload } from "../../ui/forms/base-upload";
import { MultiSelectSkills } from "../../ui/forms/base-multi-select/multi-select-skills";
import { INSTRUCTOR_EXPERIENCE_RANK_MIN } from "../schema";
import type { InstructorExperienceFieldsProps } from "./course-fields";

/** The cover photo (picked here, uploaded on submit). */
export function CoverPhotoField({ form, disabled }: InstructorExperienceFieldsProps) {
  const t = useTranslations();

  return (
    <Controller
      control={form.control}
      name="coverPhotoUrl"
      render={({ field, fieldState }) => (
        <BaseUpload
          id={field.name}
          label={t("instructorExperienceFormCoverLabel")}
          uploadType="image"
          value={field.value}
          onChange={field.onChange}
          onBlur={field.onBlur}
          validate={() => form.trigger("coverPhotoUrl")}
          disabled={disabled}
          error={fieldState.error?.message}
        />
      )}
    />
  );
}

/** The skills taught in the course (at least one). */
export function SkillsField({ form, disabled }: InstructorExperienceFieldsProps) {
  const t = useTranslations();

  return (
    <Controller
      control={form.control}
      name="skills"
      render={({ field, fieldState }) => (
        <MultiSelectSkills
          id={field.name}
          label={t("instructorExperienceFormSkillsLabel")}
          placeholder={t("instructorExperienceFormSkillsPlaceholder")}
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

/** Whether the row is shown on the website. */
export function ActiveField({ form, disabled }: InstructorExperienceFieldsProps) {
  const t = useTranslations();

  return (
    <Controller
      control={form.control}
      name="isActive"
      render={({ field, fieldState }) => (
        <BaseSwitch
          id={field.name}
          label={t("instructorExperienceFormActiveLabel")}
          description={t("instructorExperienceFormActiveHint")}
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
export function RankField({ form, disabled }: InstructorExperienceFieldsProps) {
  const t = useTranslations();

  return (
    <BaseInput
      id="rank"
      type="number"
      inputMode="numeric"
      min={INSTRUCTOR_EXPERIENCE_RANK_MIN}
      step={1}
      label={t("instructorExperienceFormRankLabel")}
      description={t("instructorExperienceFormRankHint")}
      dir="ltr"
      required
      disabled={disabled}
      error={form.formState.errors.rank?.message}
      {...form.register("rank")}
    />
  );
}
