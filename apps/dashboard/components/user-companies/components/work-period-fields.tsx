"use client";

import { useTranslations } from "next-intl";
import { Controller, useWatch } from "react-hook-form";
import { BriefcaseBusiness } from "@repo/ui/icons";
import { BaseSwitch } from "../../ui/forms/base-switch";
import { BaseMonthPicker } from "../../ui/forms/base-month-picker";
import type { UserCompanyFieldsProps } from "./company-info-fields";

/**
 * Start month, end month (no earlier than the start), and the "I still work
 * here" switch that disables the end month; render inside the form's 2-column grid.
 */
export function WorkPeriodFields({ form, disabled }: UserCompanyFieldsProps) {
  const t = useTranslations();
  const [startWorkFrom, isCurrent] = useWatch({
    control: form.control,
    name: ["startWorkFrom", "isCurrent"],
  });

  return (
    <>
      <Controller
        control={form.control}
        name="startWorkFrom"
        render={({ field, fieldState }) => (
          <BaseMonthPicker
            id={field.name}
            label={t("userCompanyFormStartLabel")}
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
        name="startWorkTo"
        render={({ field, fieldState }) => (
          <BaseMonthPicker
            id={field.name}
            label={t("userCompanyFormEndLabel")}
            placeholder={isCurrent ? t("userCompanyPresent") : undefined}
            value={isCurrent ? "" : field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            min={startWorkFrom || undefined}
            disabled={disabled || isCurrent}
            error={isCurrent ? undefined : fieldState.error?.message}
          />
        )}
      />
      <Controller
        control={form.control}
        name="isCurrent"
        render={({ field, fieldState }) => (
          <BaseSwitch
            id={field.name}
            label={t("userCompanyFormCurrentLabel")}
            description={t("userCompanyFormCurrentHint")}
            icon={<BriefcaseBusiness className="size-4" />}
            checked={field.value}
            onCheckedChange={(checked) => {
              field.onChange(checked);
              // Clear a stale "end date required" error when switching on.
              if (checked) form.clearErrors("startWorkTo");
            }}
            onBlur={field.onBlur}
            ref={field.ref}
            disabled={disabled}
            error={fieldState.error?.message}
          />
        )}
      />
    </>
  );
}
