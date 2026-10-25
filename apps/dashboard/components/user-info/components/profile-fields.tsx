"use client";

import { useTranslations } from "next-intl";
import type { UseFormReturn } from "react-hook-form";
import { BaseInput } from "../../ui/forms/base-input";
import { BaseTextarea } from "../../ui/forms/base-textarea";
import { FormSection } from "../../ui/forms/form-section";
import {
  USER_INFO_HEAD_TITLE_MAX,
  USER_INFO_SHORT_DESCRIPTION_MAX,
  type UserInfoFormInput,
  type UserInfoFormValues,
} from "../schema";

/** Props every user-info form section takes. */
export type UserInfoFieldsProps = {
  form: UseFormReturn<UserInfoFormInput, unknown, UserInfoFormValues>;
  disabled: boolean;
};

/** Head title, short description and description, each in English and Arabic. */
export function ProfileFields({ form, disabled }: UserInfoFieldsProps) {
  const t = useTranslations();
  const { errors } = form.formState;

  return (
    <FormSection
      title={t("userInfoSectionProfile")}
      description={t("userInfoSectionProfileHint")}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <BaseInput
          id="headTitle_en"
          label={t("userInfoHeadTitleEnLabel")}
          placeholder={t("userInfoHeadTitleEnPlaceholder")}
          dir="ltr"
          maxLength={USER_INFO_HEAD_TITLE_MAX}
          required
          disabled={disabled}
          error={errors.headTitle_en?.message}
          {...form.register("headTitle_en")}
        />
        <BaseInput
          id="headTitle_ar"
          label={t("userInfoHeadTitleArLabel")}
          placeholder={t("userInfoHeadTitleArPlaceholder")}
          dir="rtl"
          maxLength={USER_INFO_HEAD_TITLE_MAX}
          disabled={disabled}
          error={errors.headTitle_ar?.message}
          {...form.register("headTitle_ar")}
        />
        <BaseTextarea
          id="shortDescription_en"
          label={t("userInfoShortDescriptionEnLabel")}
          placeholder={t("userInfoShortDescriptionEnPlaceholder")}
          dir="ltr"
          rows={2}
          maxLength={USER_INFO_SHORT_DESCRIPTION_MAX}
          required
          disabled={disabled}
          error={errors.shortDescription_en?.message}
          {...form.register("shortDescription_en")}
        />
        <BaseTextarea
          id="shortDescription_ar"
          label={t("userInfoShortDescriptionArLabel")}
          placeholder={t("userInfoShortDescriptionArPlaceholder")}
          dir="rtl"
          rows={2}
          maxLength={USER_INFO_SHORT_DESCRIPTION_MAX}
          disabled={disabled}
          error={errors.shortDescription_ar?.message}
          {...form.register("shortDescription_ar")}
        />
        <BaseTextarea
          id="description_en"
          label={t("userInfoDescriptionEnLabel")}
          placeholder={t("userInfoDescriptionEnPlaceholder")}
          dir="ltr"
          rows={6}
          required
          disabled={disabled}
          error={errors.description_en?.message}
          {...form.register("description_en")}
        />
        <BaseTextarea
          id="description_ar"
          label={t("userInfoDescriptionArLabel")}
          placeholder={t("userInfoDescriptionArPlaceholder")}
          dir="rtl"
          rows={6}
          disabled={disabled}
          error={errors.description_ar?.message}
          {...form.register("description_ar")}
        />
      </div>
    </FormSection>
  );
}
