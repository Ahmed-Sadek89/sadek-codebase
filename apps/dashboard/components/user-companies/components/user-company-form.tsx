"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Controller } from "react-hook-form";
import type { UserCompanyDetails } from "@repo/types/user-company";
import { Button } from "@repo/ui/button";
import { Eye, type LucideIcon } from "@repo/ui/icons";
import { AppDialog } from "../../ui/dialog";
import { BaseSwitch } from "../../ui/forms/base-switch";
import { BaseUpload } from "../../ui/forms/base-upload";
import { useUserCompanyForm } from "../hooks/use-user-company-form";
import { toUserCompanyFormInput } from "../utils/constants";
import { CompanyInfoFields } from "./company-info-fields";
import { DescriptionFields } from "./description-fields";
import { EmploymentFields } from "./employment-fields";
import { WorkPeriodFields } from "./work-period-fields";

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
 * Create/edit-company dialog: logo; company name and website; job title and
 * employment type; location and location type; work period (start month,
 * then an end month or "I still work here"); English/Arabic descriptions.
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
  const { isSubmitting } = form.formState;

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
          <CompanyInfoFields form={form} disabled={isSubmitting} />
          <EmploymentFields form={form} disabled={isSubmitting} />
          <WorkPeriodFields form={form} disabled={isSubmitting} />
          <DescriptionFields form={form} disabled={isSubmitting} />
        </div>
        <Controller
          control={form.control}
          name="isActive"
          render={({ field, fieldState }) => (
            <BaseSwitch
              id={field.name}
              label={t("userCompanyFormActiveLabel")}
              description={t("userCompanyFormActiveHint")}
              icon={<Eye className="size-4" />}
              checkedText={t("userCompanyFormActiveOn")}
              uncheckedText={t("userCompanyFormActiveOff")}
              checked={field.value}
              onCheckedChange={field.onChange}
              onBlur={field.onBlur}
              ref={field.ref}
              disabled={isSubmitting}
              error={fieldState.error?.message}
            />
          )}
        />
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
