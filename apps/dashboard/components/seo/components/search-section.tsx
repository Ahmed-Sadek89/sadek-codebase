"use client";

import { useTranslations } from "next-intl";
import { Controller, type UseFormReturn } from "react-hook-form";
import { BaseInput } from "../../ui/forms/base-input";
import { BaseTextarea } from "../../ui/forms/base-textarea";
import { BaseUpload } from "../../ui/forms/base-upload";
import {
  SEO_META_DESCRIPTION_MAX,
  SEO_META_TITLE_MAX,
} from "../schema";
import { FieldHint } from "./char-count";
import { FormSection } from "../../ui/forms/form-section";
import type { SeoFormInput, SeoFormValues } from "../schema";

export type SeoSectionProps = {
  form: UseFormReturn<SeoFormInput, unknown, SeoFormValues>;
  disabled: boolean;
};

/** Meta title, description and keywords, in English and Arabic, then the browser tab icon. */
export function SearchSection({ form, disabled }: SeoSectionProps) {
  const t = useTranslations();
  const { errors } = form.formState;
  const { control } = form;

  return (
    <FormSection
      title={t("seoFormSearchSection")}
      description={t("seoFormSearchSectionHint")}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <BaseInput
          id="metaTitle_en"
          label={t("seoFormMetaTitleEnLabel")}
          placeholder={t("seoFormMetaTitlePlaceholder")}
          dir="ltr"
          maxLength={SEO_META_TITLE_MAX}
          required
          disabled={disabled}
          error={errors.metaTitle_en?.message}
          description={
            <FieldHint hint={t("seoFormMetaTitleEnHint")} control={control} name="metaTitle_en" max={SEO_META_TITLE_MAX} />
          }
          {...form.register("metaTitle_en")}
        />
        <BaseInput
          id="metaTitle_ar"
          label={t("seoFormMetaTitleArLabel")}
          dir="rtl"
          maxLength={SEO_META_TITLE_MAX}
          disabled={disabled}
          required
          error={errors.metaTitle_ar?.message}
          description={
            <FieldHint hint={t("seoFormMetaTitleArHint")} control={control} name="metaTitle_ar" max={SEO_META_TITLE_MAX} />
          }
          {...form.register("metaTitle_ar")}
        />
        <BaseTextarea
          id="metaDescription_en"
          label={t("seoFormMetaDescriptionEnLabel")}
          placeholder={t("seoFormMetaDescriptionPlaceholder")}
          dir="ltr"
          rows={3}
          maxLength={SEO_META_DESCRIPTION_MAX}
          required
          disabled={disabled}
          error={errors.metaDescription_en?.message}
          description={
            <FieldHint hint={t("seoFormMetaDescriptionEnHint")} control={control} name="metaDescription_en" max={SEO_META_DESCRIPTION_MAX} />
          }
          {...form.register("metaDescription_en")}
        />
        <BaseTextarea
          id="metaDescription_ar"
          label={t("seoFormMetaDescriptionArLabel")}
          dir="rtl"
          rows={3}
          maxLength={SEO_META_DESCRIPTION_MAX}
          disabled={disabled}
          required
          error={errors.metaDescription_ar?.message}
          description={
            <FieldHint hint={t("seoFormMetaDescriptionArHint")} control={control} name="metaDescription_ar" max={SEO_META_DESCRIPTION_MAX} />
          }
          {...form.register("metaDescription_ar")}
        />
        <BaseInput
          id="keywords_en"
          label={t("seoFormKeywordsEnLabel")}
          placeholder={t("seoFormKeywordsPlaceholder")}
          dir="ltr"
          disabled={disabled}
          error={errors.keywords_en?.message}
          description={t("seoFormKeywordsEnHint")}
          {...form.register("keywords_en")}
        />
        <BaseInput
          id="keywords_ar"
          label={t("seoFormKeywordsArLabel")}
          dir="rtl"
          disabled={disabled}
          error={errors.keywords_ar?.message}
          description={t("seoFormKeywordsArHint")}
          {...form.register("keywords_ar")}
        />
      </div>
      <Controller
        control={control}
        name="favicon"
        render={({ field, fieldState }) => (
          <BaseUpload
            id={field.name}
            label={t("seoFormFaviconLabel")}
            description={t("seoFormFaviconHint")}
            uploadType="image"
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            validate={() => form.trigger("favicon")}
            disabled={disabled}
            error={fieldState.error?.message}
          />
        )}
      />
    </FormSection>
  );
}
