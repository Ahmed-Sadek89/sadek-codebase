"use client";

import { useTranslations } from "next-intl";
import type { UseFormReturn } from "react-hook-form";
import { BaseInput } from "../../ui/forms/base-input";
import {
  INSTRUCTOR_EXPERIENCE_NAME_MAX,
  INSTRUCTOR_EXPERIENCE_PLATFORM_NAME_MAX,
  URL_MAX,
  type InstructorExperienceFormInput,
  type InstructorExperienceFormValues,
} from "../schema";

/** Props every instructor experience field group takes. */
export type InstructorExperienceFieldsProps = {
  form: UseFormReturn<
    InstructorExperienceFormInput,
    unknown,
    InstructorExperienceFormValues
  >;
  disabled: boolean;
};

/** Course name and link, then the platform's name and link; render inside a 2-column grid. */
export function CourseFields({ form, disabled }: InstructorExperienceFieldsProps) {
  const t = useTranslations();
  const { errors } = form.formState;

  return (
    <>
      <BaseInput
        id="name"
        label={t("instructorExperienceFormNameLabel")}
        placeholder={t("instructorExperienceFormNamePlaceholder")}
        dir="auto"
        maxLength={INSTRUCTOR_EXPERIENCE_NAME_MAX}
        required
        disabled={disabled}
        error={errors.name?.message}
        containerClassName="sm:col-span-2"
        {...form.register("name")}
      />
      <BaseInput
        id="courseLink"
        type="url"
        inputMode="url"
        label={t("instructorExperienceFormCourseLinkLabel")}
        description={t("instructorExperienceFormCourseLinkHint")}
        placeholder="https://"
        dir="ltr"
        maxLength={URL_MAX}
        required
        disabled={disabled}
        error={errors.courseLink?.message}
        containerClassName="sm:col-span-2"
        {...form.register("courseLink")}
      />
      <BaseInput
        id="coursePlatformName"
        label={t("instructorExperienceFormPlatformNameLabel")}
        placeholder={t("instructorExperienceFormPlatformNamePlaceholder")}
        dir="auto"
        maxLength={INSTRUCTOR_EXPERIENCE_PLATFORM_NAME_MAX}
        required
        disabled={disabled}
        error={errors.coursePlatformName?.message}
        {...form.register("coursePlatformName")}
      />
      <BaseInput
        id="coursePlatformUrl"
        type="url"
        inputMode="url"
        label={t("instructorExperienceFormPlatformUrlLabel")}
        placeholder="https://"
        dir="ltr"
        maxLength={URL_MAX}
        required
        disabled={disabled}
        error={errors.coursePlatformUrl?.message}
        {...form.register("coursePlatformUrl")}
      />
    </>
  );
}
