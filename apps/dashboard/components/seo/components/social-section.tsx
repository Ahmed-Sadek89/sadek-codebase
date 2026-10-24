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
import { BaseInput } from "../../ui/forms/base-input";
import { BaseTextarea } from "../../ui/forms/base-textarea";
import { BaseUpload } from "../../ui/forms/base-upload";
import {
  SEO_OG_DESCRIPTION_MAX,
  SEO_OG_IMAGE_ALT_MAX,
  SEO_OG_TITLE_MAX,
  SEO_TWITTER_HANDLE_MAX,
} from "../schema";
import { FieldHint } from "./char-count";
import type { SeoSectionProps } from "./search-section";
import { TWITTER_CARD_OPTIONS } from "../utils/constants";
import { FormSection } from "../../ui/forms/form-section";



/** Open Graph and X card fields: share image, texts, card size and handle. */
export function SocialSection({ form, disabled }: SeoSectionProps) {
  const t = useTranslations();
  const { errors } = form.formState;
  const { control } = form;

  return (
    <FormSection
      title={t("seoFormSocialSection")}
      description={t("seoFormSocialSectionHint")}
    >
      <Controller
        control={control}
        name="ogImage"
        render={({ field, fieldState }) => (
          <BaseUpload
            id={field.name}
            label={t("seoFormOgImageLabel")}
            description={t("seoFormOgImageHint")}
            uploadType="image"
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            validate={() => form.trigger("ogImage")}
            disabled={disabled}
            error={fieldState.error?.message}
          />
        )}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <BaseInput
          id="ogTitle_en"
          label={t("seoFormOgTitleEnLabel")}
          dir="ltr"
          maxLength={SEO_OG_TITLE_MAX}
          disabled={disabled}
          error={errors.ogTitle_en?.message}
          description={
            <FieldHint hint={t("seoFormOgTitleEnHint")} control={control} name="ogTitle_en" max={SEO_OG_TITLE_MAX} />
          }
          {...form.register("ogTitle_en")}
        />
        <BaseInput
          id="ogTitle_ar"
          label={t("seoFormOgTitleArLabel")}
          dir="rtl"
          maxLength={SEO_OG_TITLE_MAX}
          disabled={disabled}
          error={errors.ogTitle_ar?.message}
          description={
            <FieldHint hint={t("seoFormOgTitleArHint")} control={control} name="ogTitle_ar" max={SEO_OG_TITLE_MAX} />
          }
          {...form.register("ogTitle_ar")}
        />
        <BaseTextarea
          id="ogDescription_en"
          label={t("seoFormOgDescriptionEnLabel")}
          dir="ltr"
          rows={3}
          maxLength={SEO_OG_DESCRIPTION_MAX}
          disabled={disabled}
          error={errors.ogDescription_en?.message}
          description={
            <FieldHint hint={t("seoFormOgDescriptionEnHint")} control={control} name="ogDescription_en" max={SEO_OG_DESCRIPTION_MAX} />
          }
          {...form.register("ogDescription_en")}
        />
        <BaseTextarea
          id="ogDescription_ar"
          label={t("seoFormOgDescriptionArLabel")}
          dir="rtl"
          rows={3}
          maxLength={SEO_OG_DESCRIPTION_MAX}
          disabled={disabled}
          error={errors.ogDescription_ar?.message}
          description={
            <FieldHint hint={t("seoFormOgDescriptionArHint")} control={control} name="ogDescription_ar" max={SEO_OG_DESCRIPTION_MAX} />
          }
          {...form.register("ogDescription_ar")}
        />
        <BaseInput
          id="ogImageAlt_en"
          label={t("seoFormOgImageAltEnLabel")}
          dir="ltr"
          maxLength={SEO_OG_IMAGE_ALT_MAX}
          disabled={disabled}
          error={errors.ogImageAlt_en?.message}
          description={t("seoFormOgImageAltEnHint")}
          {...form.register("ogImageAlt_en")}
        />
        <BaseInput
          id="ogImageAlt_ar"
          label={t("seoFormOgImageAltArLabel")}
          dir="rtl"
          maxLength={SEO_OG_IMAGE_ALT_MAX}
          disabled={disabled}
          error={errors.ogImageAlt_ar?.message}
          description={t("seoFormOgImageAltArHint")}
          {...form.register("ogImageAlt_ar")}
        />
        <Controller
          control={control}
          name="twitterCard"
          render={({ field }) => (
            <div className="flex flex-col gap-y-2">
              <Label htmlFor={field.name}>
                {t("seoFormTwitterCardLabel")}
              </Label>
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
                  aria-describedby={`${field.name}-hint`}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TWITTER_CARD_OPTIONS.map((card) => (
                    <SelectItem key={card.value} value={card.value}>
                      {t(card.labelKey)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p id={`${field.name}-hint`} className="text-xs text-muted-foreground">
                {t("seoFormTwitterCardHint")}
              </p>
            </div>
          )}
        />
        <BaseInput
          id="twitterHandle"
          label={t("seoFormTwitterHandleLabel")}
          placeholder="@username"
          dir="ltr"
          maxLength={SEO_TWITTER_HANDLE_MAX}
          disabled={disabled}
          error={errors.twitterHandle?.message}
          description={t("seoFormTwitterHandleHint")}
          {...form.register("twitterHandle")}
        />
      </div>
    </FormSection>
  );
}
