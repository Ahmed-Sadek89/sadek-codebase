"use client";

import { useTranslations } from "next-intl";
import { Controller } from "react-hook-form";
import { Link2, ScanSearch } from "@repo/ui/icons";
import { BaseInput } from "../../ui/forms/base-input";
import { BaseSwitch } from "../../ui/forms/base-switch";
import { SEO_JOB_TITLE_MAX } from "../schema";
import type { SeoSectionProps } from "./search-section";
import { FormSection } from "../../ui/forms/form-section";



/** Job title for structured data and the robots index/follow switches. */
export function IndexingSection({ form, disabled }: SeoSectionProps) {
  const t = useTranslations();
  const { errors } = form.formState;
  const { control } = form;

  return (
    <FormSection
      title={t("seoFormIndexingSection")}
      description={t("seoFormIndexingSectionHint")}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <BaseInput
          id="jobTitle_en"
          label={t("seoFormJobTitleEnLabel")}
          placeholder={t("seoFormJobTitlePlaceholder")}
          dir="ltr"
          maxLength={SEO_JOB_TITLE_MAX}
          disabled={disabled}
          error={errors.jobTitle_en?.message}
          description={t("seoFormJobTitleEnHint")}
          {...form.register("jobTitle_en")}
        />
        <BaseInput
          id="jobTitle_ar"
          label={t("seoFormJobTitleArLabel")}
          dir="rtl"
          maxLength={SEO_JOB_TITLE_MAX}
          disabled={disabled}
          error={errors.jobTitle_ar?.message}
          description={t("seoFormJobTitleArHint")}
          {...form.register("jobTitle_ar")}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Controller
          control={control}
          name="robotsIndex"
          render={({ field, fieldState }) => (
            <BaseSwitch
              id={field.name}
              label={t("seoFormRobotsIndexLabel")}
              description={t("seoFormRobotsIndexHint")}
              icon={<ScanSearch className="size-4" />}
              checkedText={t("seoFormOn")}
              uncheckedText={t("seoFormOff")}
              checked={field.value}
              onCheckedChange={field.onChange}
              onBlur={field.onBlur}
              ref={field.ref}
              disabled={disabled}
              error={fieldState.error?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="robotsFollow"
          render={({ field, fieldState }) => (
            <BaseSwitch
              id={field.name}
              label={t("seoFormRobotsFollowLabel")}
              description={t("seoFormRobotsFollowHint")}
              icon={<Link2 className="size-4" />}
              checkedText={t("seoFormOn")}
              uncheckedText={t("seoFormOff")}
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
    </FormSection>
  );
}
