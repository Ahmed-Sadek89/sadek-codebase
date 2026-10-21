"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Controller, useWatch } from "react-hook-form";
import type { UserCompanyDetails } from "@repo/types/user-company";
import { Button } from "@repo/ui/button";
import { BriefcaseBusiness, type LucideIcon } from "@repo/ui/icons";
import { AppDialog } from "../../ui/dialog";
import { BaseInput } from "../../ui/forms/base-input";
import { BaseTextarea } from "../../ui/forms/base-textarea";
import { BaseSwitch } from "../../ui/forms/base-switch";
import { BaseUpload } from "../../ui/forms/base-upload";
import { BaseMonthPicker } from "../../ui/forms/base-month-picker";
import { useUserCompanyForm } from "../hooks/use-user-company-form";
import { toUserCompanyFormInput } from "../utils/constants";
import { USER_COMPANY_NAME_MAX, USER_COMPANY_URL_MAX } from "../schema";

export type UserCompanyFormProps = {
  isOpenDialog: boolean;
  handleOpenDialog: (open: boolean) => void;
  title: string;
  description?: string;
  Icon: LucideIcon;
  role?: "edit" | "create";
  /** The selected row when editing; its values fill the inputs. */
  defaultValues?: UserCompanyDetails | null;
};

/**
 * Create/edit-company dialog: logo, English/Arabic names and descriptions,
 * work period (start month, then an end month or "I still work here"), and
 * the company website.
 */
export function UserCompanyForm({
  isOpenDialog,
  handleOpenDialog,
  title,
  description = "",
  Icon,
  role = "create",
  defaultValues = null,
}: UserCompanyFormProps) {
  const t = useTranslations();
  const { form, onSubmit } = useUserCompanyForm({
    company: defaultValues,
    onSuccess: () => handleOpenDialog(false),
  });
  const { errors, isSubmitting } = form.formState;
  const [startWorkFrom, isCurrent] = useWatch({
    control: form.control,
    name: ["startWorkFrom", "isCurrent"],
  });

  // Fill the inputs each time the dialog opens: the selected row when
  // editing, blank when creating. Not on close, so fields don't flash empty
  // during the close animation.
  useEffect(() => {
    if (isOpenDialog) form.reset(toUserCompanyFormInput(defaultValues));
  }, [isOpenDialog, defaultValues, form]);

  return (
    <AppDialog
      open={isOpenDialog}
      onOpenChange={handleOpenDialog}
      className="sm:max-w-3xl max-h-[85dvh]! overflow-y-auto!"
      title={title}
      description={description}
      Icon={Icon}
    >
      <form
        onSubmit={onSubmit}
        noValidate
        className="space-y-5"
        aria-busy={isSubmitting}
      >
        <Controller
          control={form.control}
          name="logo"
          render={({ field, fieldState }) => (
            <BaseUpload
              id={field.name}
              label={t("userCompanyFormLogoLabel")}
              uploadType="image"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              validate={() => form.trigger("logo")}
              disabled={isSubmitting}
              error={fieldState.error?.message}
            />
          )}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <BaseInput
            id="name_en"
            label={t("userCompanyFormNameEnLabel")}
            placeholder={t("userCompanyFormNameEnPlaceholder")}
            dir="ltr"
            maxLength={USER_COMPANY_NAME_MAX}
            required
            disabled={isSubmitting}
            error={errors.name_en?.message}
            {...form.register("name_en")}
          />
          <BaseInput
            id="name_ar"
            label={t("userCompanyFormNameArLabel")}
            placeholder={t("userCompanyFormNameArPlaceholder")}
            dir="rtl"
            maxLength={USER_COMPANY_NAME_MAX}
            disabled={isSubmitting}
            error={errors.name_ar?.message}
            {...form.register("name_ar")}
          />
          <BaseTextarea
            id="description_en"
            label={t("userCompanyFormDescriptionEnLabel")}
            placeholder={t("userCompanyFormDescriptionEnPlaceholder")}
            dir="ltr"
            rows={4}
            disabled={isSubmitting}
            error={errors.description_en?.message}
            {...form.register("description_en")}
          />
          <BaseTextarea
            id="description_ar"
            label={t("userCompanyFormDescriptionArLabel")}
            placeholder={t("userCompanyFormDescriptionArPlaceholder")}
            dir="rtl"
            rows={4}
            disabled={isSubmitting}
            error={errors.description_ar?.message}
            {...form.register("description_ar")}
          />
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
                disabled={isSubmitting}
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
                disabled={isSubmitting || isCurrent}
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
                disabled={isSubmitting}
                error={fieldState.error?.message}
              />
            )}
          />
          <BaseInput
            id="company_site"
            type="url"
            inputMode="url"
            label={t("userCompanyFormSiteLabel")}
            placeholder="https://"
            dir="ltr"
            maxLength={USER_COMPANY_URL_MAX}
            disabled={isSubmitting}
            error={errors.company_site?.message}
            containerClassName="self-start"
            {...form.register("company_site")}
          />
        </div>
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline-danger"
            disabled={isSubmitting}
            onClick={() => handleOpenDialog(false)}
          >
            {t("categorySkillFormCancel")}
          </Button>
          <Button
            type="submit"
            variant={role === "create" ? "success" : "default"}
            disabled={isSubmitting}
          >
            {role === "create"
              ? t("userCompanyFormSubmit")
              : t("categorySkillFormEditSubmit")}
          </Button>
        </div>
      </form>
    </AppDialog>
  );
}
