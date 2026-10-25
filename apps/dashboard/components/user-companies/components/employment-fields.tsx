"use client";

import { useTranslations } from "next-intl";
import { Controller } from "react-hook-form";
import {
  USER_COMPANY_JOB_TITLE_MAX,
  USER_COMPANY_LOCATION_MAX,
} from "@repo/constants/user-company";
import { Label } from "@repo/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";
import type { MessageKey } from "../../../i18n/types";
import { BaseInput } from "../../ui/forms/base-input";
import {
  EMPLOYMENT_TYPE_OPTIONS,
  LOCATION_TYPE_OPTIONS,
} from "../utils/constants";
import type { UserCompanyFieldsProps } from "./company-info-fields";

type OptionFieldProps = UserCompanyFieldsProps & {
  name: "location_type" | "employment_type";
  labelKey: MessageKey;
  options: { value: string; labelKey: MessageKey }[];
};

/** A required select that starts blank and shows its validation error. */
function OptionField({
  form,
  disabled,
  name,
  labelKey,
  options,
}: OptionFieldProps) {
  const t = useTranslations();

  return (
    <Controller
      control={form.control}
      name={name}
      render={({ field, fieldState }) => {
        const errorId = `${field.name}-error`;
        return (
          <div className="flex flex-col gap-y-2">
            <Label htmlFor={field.name}>{t(labelKey)}</Label>
            <Select
              value={field.value}
              onValueChange={field.onChange}
              disabled={disabled}
              required
            >
              <SelectTrigger
                id={field.name}
                ref={field.ref}
                onBlur={field.onBlur}
                className="w-full"
                aria-invalid={fieldState.error ? true : undefined}
                aria-describedby={fieldState.error ? errorId : undefined}
              >
                <SelectValue placeholder={t("userCompanyFormSelectPlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {t(option.labelKey)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fieldState.error?.message && (
              <p id={errorId} role="alert" className="text-sm text-danger">
                {fieldState.error.message}
              </p>
            )}
          </div>
        );
      }}
    />
  );
}

/**
 * Job title beside the employment type, then location beside the location
 * type; all four are required. Render inside the form's 2-column grid.
 */
export function EmploymentFields({ form, disabled }: UserCompanyFieldsProps) {
  const t = useTranslations();
  const { errors } = form.formState;

  return (
    <>
      <BaseInput
        id="job_title"
        label={t("userCompanyFormJobTitleLabel")}
        placeholder={t("userCompanyFormJobTitlePlaceholder")}
        dir="auto"
        maxLength={USER_COMPANY_JOB_TITLE_MAX}
        required
        disabled={disabled}
        error={errors.job_title?.message}
        {...form.register("job_title")}
      />
      <OptionField
        form={form}
        disabled={disabled}
        name="employment_type"
        labelKey="userCompanyFormEmploymentTypeLabel"
        options={EMPLOYMENT_TYPE_OPTIONS}
      />
      <BaseInput
        id="location"
        label={t("userCompanyFormLocationLabel")}
        placeholder={t("userCompanyFormLocationPlaceholder")}
        dir="auto"
        maxLength={USER_COMPANY_LOCATION_MAX}
        required
        disabled={disabled}
        error={errors.location?.message}
        {...form.register("location")}
      />
      <OptionField
        form={form}
        disabled={disabled}
        name="location_type"
        labelKey="userCompanyFormLocationTypeLabel"
        options={LOCATION_TYPE_OPTIONS}
      />
    </>
  );
}
