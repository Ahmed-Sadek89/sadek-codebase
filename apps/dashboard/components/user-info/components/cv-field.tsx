"use client";

import { useTranslations } from "next-intl";
import { Controller, useWatch, type UseFormReturn } from "react-hook-form";
import { CloudUpload, Link2, type LucideIcon } from "@repo/ui/icons";
import { cn } from "@repo/ui/utils";
import type { MessageKey } from "../../../i18n/types";
import { BaseInput } from "../../ui/forms/base-input";
import { BaseUpload } from "../../ui/forms/base-upload";
import {
  USER_INFO_LINK_MAX,
  type CvSource,
  type UserInfoFormInput,
  type UserInfoFormValues,
} from "../schema";

const CV_SOURCE_OPTIONS: {
  value: CvSource;
  labelKey: MessageKey;
  icon: LucideIcon;
}[] = [
  { value: "upload", labelKey: "userInfoCvSourceUpload", icon: CloudUpload },
  { value: "link", labelKey: "userInfoCvSourceLink", icon: Link2 },
];

type CvFieldProps = {
  form: UseFormReturn<UserInfoFormInput, unknown, UserInfoFormValues>;
  setCvSource: (source: CvSource) => void;
  disabled?: boolean;
};

/** The CV: either an uploaded PDF/Word file or a Google Drive share link. */
export function CvField({ form, setCvSource, disabled = false }: CvFieldProps) {
  const t = useTranslations();
  const source = useWatch({ control: form.control, name: "cvSource" });
  const linkHintId = "cvLink-hint";

  return (
    <fieldset className="space-y-3" disabled={disabled}>
      <legend className="mb-2 text-sm font-medium">
        {t("userInfoCvLabel")}
      </legend>
      <div className="grid grid-cols-2 gap-1 rounded-lg border border-border bg-muted/40 p-1 sm:inline-grid sm:min-w-80">
        {CV_SOURCE_OPTIONS.map(({ value, labelKey, icon: Icon }) => {
          const isChecked = source === value;
          return (
            <label
              key={value}
              className={cn(
                "flex cursor-pointer items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                "has-focus-visible:ring-2 has-focus-visible:ring-ring/50",
                isChecked
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
                disabled && "cursor-not-allowed opacity-50",
              )}
            >
              <input
                type="radio"
                name="cvSource"
                value={value}
                checked={isChecked}
                onChange={() => setCvSource(value)}
                className="sr-only"
              />
              <Icon className="size-4 shrink-0" aria-hidden />
              <span className="truncate">{t(labelKey)}</span>
            </label>
          );
        })}
      </div>

      {source === "upload" ? (
        <Controller
          control={form.control}
          name="cv"
          render={({ field, fieldState }) => (
            <BaseUpload
              id={field.name}
              label={t("userInfoCvFileLabel")}
              uploadType="document"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              validate={() => form.trigger("cv")}
              disabled={disabled}
              error={fieldState.error?.message}
            />
          )}
        />
      ) : (
        <div className="space-y-2">
          <BaseInput
            id="cvLink"
            type="url"
            inputMode="url"
            label={t("userInfoCvLinkLabel")}
            placeholder="https://drive.google.com/file/d/…/view"
            dir="ltr"
            maxLength={USER_INFO_LINK_MAX}
            aria-describedby={linkHintId}
            error={form.formState.errors.cvLink?.message}
            {...form.register("cvLink")}
          />
          <p id={linkHintId} className="text-xs text-muted-foreground">
            {t("userInfoCvLinkHint")}
          </p>
        </div>
      )}
    </fieldset>
  );
}
