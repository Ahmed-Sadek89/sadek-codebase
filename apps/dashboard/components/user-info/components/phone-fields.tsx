"use client";

import { useTranslations } from "next-intl";
import { BaseInput } from "../../ui/forms/base-input";
import { FormSection } from "../../ui/forms/form-section";
import { PHONE_MAX } from "../schema";
import type { UserInfoFieldsProps } from "./profile-fields";

/** The required phone and WhatsApp numbers. */
export function PhoneFields({ form, disabled }: UserInfoFieldsProps) {
  const t = useTranslations();
  const { errors } = form.formState;
  return (
    <FormSection
      title={t("userInfoSectionPhones")}
      description={t("userInfoSectionPhonesHint")}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <BaseInput
          id="phoneNumber"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          label={t("userInfoPhoneLabel")}
          placeholder="+20 100 123 4567"
          dir="ltr"
          maxLength={PHONE_MAX}
          required
          disabled={disabled}
          error={errors.phoneNumber?.message}
          {...form.register("phoneNumber")}
        />
        <BaseInput
          id="whatsappNumber"
          type="tel"
          inputMode="tel"
          label={t("userInfoWhatsappLabel")}
          placeholder="+20 100 123 4567"
          dir="ltr"
          maxLength={PHONE_MAX}
          required
          disabled={disabled}
          error={errors.whatsappNumber?.message}
          {...form.register("whatsappNumber")}
        />
      </div>
    </FormSection>
  );
}
