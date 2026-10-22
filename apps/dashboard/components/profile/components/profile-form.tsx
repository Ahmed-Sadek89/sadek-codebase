"use client";

import { useTranslations } from "next-intl";
import { Controller } from "react-hook-form";
import type { CurrentUser } from "@repo/types/auth";
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Eye, LoaderCircle, Save, X } from "@repo/ui/icons";
import { cn } from "@repo/ui/utils";
import { BaseInput } from "../../ui/forms/base-input";
import { BaseUpload } from "../../ui/forms/base-upload";
import { FormSection } from "../../ui/forms/form-section";
import { useProfileForm } from "../hooks/use-profile-form";
import { PROFILE_EMAIL_MAX, PROFILE_USERNAME_MAX } from "../schema";
import { ProfileHero } from "./profile-hero";

type ProfileFormProps = {
  user: CurrentUser;
  /** Leaves the form without saving. */
  onCancel: () => void;
};

/**
 * Edit form for the signed-in user, under a live preview of the profile card.
 * Submitting only logs the values for now.
 */
export function ProfileForm({ user, onCancel }: ProfileFormProps) {
  const t = useTranslations();
  const { form, onSubmit, preview, isPending } = useProfileForm({ user });
  const { errors, isDirty } = form.formState;

  return (
    <div className="space-y-6">
      <ProfileHero
        id={user.id}
        username={preview.username}
        email={preview.email}
        avatarSrc={preview.avatarSrc}
        coverSrc={preview.coverSrc}
        badge={
          <span className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1 text-xs font-medium text-card-foreground shadow-sm">
            <Eye className="size-3.5 text-primary" aria-hidden />
            {t("profilePreview")}
          </span>
        }
      />

      <Card className="gap-0 py-0">
        <form onSubmit={onSubmit} noValidate aria-busy={isPending}>
          <div className="space-y-1 border-b border-border px-4 py-5 sm:px-6">
            <h2 className="text-lg font-semibold">{t("profileEditTitle")}</h2>
            <p className="text-sm text-muted-foreground">
              {t("profileFormHint")}
            </p>
          </div>

          <div className="space-y-6 px-4 py-6 sm:px-6">
            <FormSection
              title={t("profileSectionAccount")}
              description={t("profileSectionAccountHint")}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <BaseInput
                  id="username"
                  autoComplete="username"
                  label={t("profileUsernameLabel")}
                  placeholder={t("profileUsernamePlaceholder")}
                  dir="auto"
                  maxLength={PROFILE_USERNAME_MAX}
                  required
                  disabled={isPending}
                  error={errors.username?.message}
                  {...form.register("username")}
                />
                <BaseInput
                  id="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  label={t("profileEmailLabel")}
                  placeholder="name@example.com"
                  dir="ltr"
                  maxLength={PROFILE_EMAIL_MAX}
                  required
                  disabled={isPending}
                  error={errors.email?.message}
                  {...form.register("email")}
                />
              </div>
            </FormSection>

            <FormSection
              title={t("profileSectionImages")}
              description={t("profileSectionImagesHint")}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Controller
                  control={form.control}
                  name="avatarUrl"
                  render={({ field, fieldState }) => (
                    <BaseUpload
                      id={field.name}
                      label={t("profileAvatarLabel")}
                      uploadType="image"
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      validate={() => form.trigger("avatarUrl")}
                      disabled={isPending}
                      error={fieldState.error?.message}
                    />
                  )}
                />
                <Controller
                  control={form.control}
                  name="coverPhotoUrl"
                  render={({ field, fieldState }) => (
                    <BaseUpload
                      id={field.name}
                      label={t("profileCoverLabel")}
                      uploadType="image"
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      validate={() => form.trigger("coverPhotoUrl")}
                      disabled={isPending}
                      error={fieldState.error?.message}
                    />
                  )}
                />
              </div>
            </FormSection>
          </div>

          <div className="sticky bottom-0 flex flex-col gap-3 rounded-b-xl border-t border-border bg-surface px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p
              aria-live="polite"
              className={cn(
                "flex items-center gap-2 text-sm",
                isDirty ? "text-warning" : "text-muted-foreground",
              )}
            >
              <span
                className={cn(
                  "size-2 rounded-full",
                  isDirty ? "bg-warning" : "bg-muted-foreground",
                )}
                aria-hidden
              />
              {isDirty ? t("profileUnsaved") : t("profileNoChanges")}
            </p>
            <div className="flex flex-col-reverse gap-2 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                disabled={isPending}
                onClick={onCancel}
              >
                <X className="size-4" aria-hidden />
                {t("profileCancel")}
              </Button>
              <Button type="submit" disabled={isPending || !isDirty}>
                {isPending ? (
                  <LoaderCircle className="size-4 animate-spin" aria-hidden />
                ) : (
                  <Save className="size-4" aria-hidden />
                )}
                {t("profileSave")}
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}
