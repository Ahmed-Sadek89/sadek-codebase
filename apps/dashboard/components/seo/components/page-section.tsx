"use client";

import { useTranslations } from "next-intl";
import { Controller } from "react-hook-form";
import { Label } from "@repo/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";
import { FormSection } from "../../ui/forms/form-section";
import { SEO_PAGES } from "../utils/constants";
import type { SeoSectionProps } from "./search-section";

/** The website page this SEO version is for, chosen first. */
export function PageSection({ form, disabled }: SeoSectionProps) {
  const t = useTranslations();

  return (
    <FormSection
      title={t("seoFormPageSection")}
      description={t("seoFormPageSectionHint")}
    >
      <Controller
        control={form.control}
        name="pageName"
        render={({ field, fieldState }) => (
          <div className="flex flex-col gap-y-2 sm:max-w-sm">
            <Label htmlFor={field.name}>{t("seoFormPageLabel")}</Label>
            <Select
              value={field.value}
              onValueChange={field.onChange}
              disabled={disabled}
            >
              <SelectTrigger
                id={field.name}
                ref={field.ref}
                onBlur={field.onBlur}
                className="w-full"
                aria-invalid={fieldState.error ? true : undefined}
                aria-describedby={`${field.name}-hint`}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SEO_PAGES.map((page) => (
                  <SelectItem key={page.value} value={page.value}>
                    {t(page.labelKey)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p id={`${field.name}-hint`} className="text-xs text-muted-foreground">
              {t("seoFormPageHint")}
            </p>
            {fieldState.error && (
              <p role="alert" className="text-sm text-danger">
                {fieldState.error.message}
              </p>
            )}
          </div>
        )}
      />
    </FormSection>
  );
}
