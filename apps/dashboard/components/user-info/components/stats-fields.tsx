"use client";

import { useTranslations } from "next-intl";
import { BaseInput } from "../../ui/forms/base-input";
import { FormSection } from "../../ui/forms/form-section";
import { USER_INFO_COUNT_MIN } from "../schema";
import { USER_INFO_STATS } from "../utils/constants";
import type { UserInfoFieldsProps } from "./profile-fields";

/** The four counters (years of experience, companies, projects, technologies). */
export function StatsFields({ form, disabled }: UserInfoFieldsProps) {
  const t = useTranslations();
  const { errors } = form.formState;

  return (
    <FormSection
      title={t("userInfoSectionNumbers")}
      description={t("userInfoSectionNumbersHint")}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {USER_INFO_STATS.map(({ field, labelKey }) => (
          <BaseInput
            key={field}
            id={field}
            type="number"
            inputMode="numeric"
            min={USER_INFO_COUNT_MIN}
            step={1}
            label={t(labelKey)}
            required
            disabled={disabled}
            error={errors[field]?.message}
            {...form.register(field, { valueAsNumber: true })}
          />
        ))}
      </div>
    </FormSection>
  );
}
