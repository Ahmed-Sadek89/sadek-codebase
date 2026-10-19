"use client";

import { useTranslations } from "next-intl";
import type { UserInfoDetails } from "@repo/types/user-info";
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { LoaderCircle, Save, X } from "@repo/ui/icons";
import { BaseInput } from "../../ui/forms/base-input";
import { BaseTextarea } from "../../ui/forms/base-textarea";
import { useUserInfoForm } from "../hooks/use-user-info-form";
import {
  USER_INFO_HEAD_TITLE_MAX,
  USER_INFO_LINK_MAX,
  USER_INFO_SHORT_DESCRIPTION_MAX,
} from "../schema";
import { USER_INFO_STATS } from "../utils/constants";
import { CvField } from "./cv-field";
import { FormSection } from "./form-section";

type UserInfoFormProps = {
  /** The saved row to edit; null creates the first one. */
  userInfo: UserInfoDetails | null;
  /** Leaves the form without saving. */
  onCancel: () => void;
  /** Runs after a successful save. */
  onSaved: () => void;
};

/** Create/edit form for the user's info, in three sections. */
export function UserInfoForm({
  userInfo,
  onCancel,
  onSaved,
}: UserInfoFormProps) {
  const t = useTranslations();
  const { form, onSubmit, setCvSource, isPending } = useUserInfoForm({
    userInfo,
    onSuccess: onSaved,
  });
  const { errors } = form.formState;
  const isCreate = userInfo === null;

  return (
    <Card className="px-4 sm:px-6">
      <form
        onSubmit={onSubmit}
        noValidate
        aria-busy={isPending}
        className="space-y-6"
      >
        <div className="space-y-1 border-b border-border pb-4">
          <h2 className="text-lg font-semibold">
            {isCreate ? t("userInfoCreateTitle") : t("userInfoEditTitle")}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t("userInfoFormHint")}
          </p>
        </div>

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
              disabled={isPending}
              error={errors.headTitle_en?.message}
              {...form.register("headTitle_en")}
            />
            <BaseInput
              id="headTitle_ar"
              label={t("userInfoHeadTitleArLabel")}
              placeholder={t("userInfoHeadTitleArPlaceholder")}
              dir="rtl"
              maxLength={USER_INFO_HEAD_TITLE_MAX}
              disabled={isPending}
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
              disabled={isPending}
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
              disabled={isPending}
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
              disabled={isPending}
              error={errors.description_en?.message}
              {...form.register("description_en")}
            />
            <BaseTextarea
              id="description_ar"
              label={t("userInfoDescriptionArLabel")}
              placeholder={t("userInfoDescriptionArPlaceholder")}
              dir="rtl"
              rows={6}
              disabled={isPending}
              error={errors.description_ar?.message}
              {...form.register("description_ar")}
            />
          </div>
        </FormSection>

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
                min={0}
                step={1}
                label={t(labelKey)}
                required
                disabled={isPending}
                error={errors[field]?.message}
                {...form.register(field, { valueAsNumber: true })}
              />
            ))}
          </div>
        </FormSection>

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
              maxLength={USER_INFO_LINK_MAX}
              disabled={isPending}
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
              maxLength={USER_INFO_LINK_MAX}
              disabled={isPending}
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
              maxLength={USER_INFO_LINK_MAX}
              disabled={isPending}
              error={errors.github?.message}
              containerClassName="sm:col-span-2"
              {...form.register("github")}
            />
          </div>
          <CvField form={form} setCvSource={setCvSource} disabled={isPending} />
        </FormSection>

        <div className="flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={onCancel}
          >
            <X className="size-4" aria-hidden />
            {t("userInfoCancel")}
          </Button>
          <Button
            type="submit"
            variant={isCreate ? "success" : "default"}
            disabled={isPending}
          >
            {isPending ? (
              <LoaderCircle className="size-4 animate-spin" aria-hidden />
            ) : (
              <Save className="size-4" aria-hidden />
            )}
            {isCreate ? t("userInfoCreateSubmit") : t("userInfoSave")}
          </Button>
        </div>
      </form>
    </Card>
  );
}
