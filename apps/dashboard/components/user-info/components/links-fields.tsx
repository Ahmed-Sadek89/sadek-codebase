"use client";

import { useTranslations } from "next-intl";
import { BaseInput } from "../../ui/forms/base-input";
import { FormSection } from "../../ui/forms/form-section";
import { URL_MAX, type CvSource } from "../schema";
import { CvField } from "./cv-field";
import type { UserInfoFieldsProps } from "./profile-fields";

type LinksFieldsProps = UserInfoFieldsProps & {
  setCvSource: (source: CvSource) => void;
};

/** The optional Gmail, LinkedIn and GitHub links, then the CV. */
export function LinksFields({ form, disabled, setCvSource }: LinksFieldsProps) {
  const t = useTranslations();
  const { errors } = form.formState;

  return (
    <FormSection
      title={t("userInfoSectionLinks")}
      description={t("userInfoSectionLinksHint")}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <BaseInput
          id="gmail"
          type="email"
          inputMode="email"
          autoComplete="email"
          label={t("userInfoGmailLabel")}
          placeholder="name@gmail.com"
          dir="ltr"
          maxLength={URL_MAX}
          disabled={disabled}
          error={errors.gmail?.message}
          {...form.register("gmail")}
        />
        <BaseInput
          id="linkedin"
          type="url"
          inputMode="url"
          label={t("userInfoLinkedinLabel")}
          placeholder="https://www.linkedin.com/in/"
          dir="ltr"
          maxLength={URL_MAX}
          disabled={disabled}
          error={errors.linkedin?.message}
          {...form.register("linkedin")}
        />
        <BaseInput
          id="github"
          type="url"
          inputMode="url"
          label={t("userInfoGithubLabel")}
          placeholder="https://github.com/"
          dir="ltr"
          maxLength={URL_MAX}
          disabled={disabled}
          error={errors.github?.message}
          containerClassName="sm:col-span-2"
          {...form.register("github")}
        />
      </div>
      <CvField form={form} setCvSource={setCvSource} disabled={disabled} />
    </FormSection>
  );
}
