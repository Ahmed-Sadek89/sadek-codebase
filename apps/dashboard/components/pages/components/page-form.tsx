"use client";

import { useEffect } from "react";
import type { Page } from "@repo/types/pages";
import { useTranslations } from "next-intl";
import { Button } from "@repo/ui/button";
import type { LucideIcon } from "@repo/ui/icons";
import { AppDialog } from "../../ui/dialog";
import { BaseInput } from "../../ui/forms/base-input";
import { usePageForm } from "../hooks/use-page-form";
import { toPageFormInput } from "../utils/constants";
import { PAGE_NAME_MAX } from "../schema";

export type PageFormProps = {
  isOpenDialog: boolean;
  handleOpenDialog: (open: boolean) => void;
  title: string;
  description?: string;
  Icon: LucideIcon;
  role?: "edit" | "create";
  /** The selected row when editing; its values fill the inputs. */
  defaultValues?: Page | null;
};

/** Create/edit-page dialog: the English and Arabic names. */
export function PageForm({
  isOpenDialog,
  handleOpenDialog,
  title,
  description = "",
  Icon,
  role = "create",
  defaultValues = null,
}: PageFormProps) {
  const t = useTranslations();
  const { form, onSubmit } = usePageForm({
    page: defaultValues,
    onSuccess: () => handleOpenDialog(false),
  });
  const { errors, isSubmitting } = form.formState;

  // Fill the inputs each time the dialog opens: the selected row when
  // editing, blank when creating. Not on close, so fields don't flash empty
  // during the close animation.
  useEffect(() => {
    if (isOpenDialog) form.reset(toPageFormInput(defaultValues));
  }, [isOpenDialog, defaultValues, form]);

  const onOpenChange = (open: boolean) => handleOpenDialog(open);

  return (
    <AppDialog
      open={isOpenDialog}
      onOpenChange={onOpenChange}
      className="sm:max-w-xl"
      title={title}
      description={description}
      Icon={Icon}
    >
      <form onSubmit={onSubmit} noValidate className="space-y-5" aria-busy={isSubmitting}>
        <div className="grid gap-4 sm:grid-cols-2">
          <BaseInput
            id="name_en"
            label={t("pageFormNameEnLabel")}
            placeholder="Home"
            dir="ltr"
            maxLength={PAGE_NAME_MAX}
            required
            disabled={isSubmitting}
            error={errors.name_en?.message}
            description={t("pageFormNameEnHint")}
            {...form.register("name_en")}
          />
          <BaseInput
            id="name_ar"
            label={t("pageFormNameArLabel")}
            placeholder="الرئيسية"
            dir="rtl"
            maxLength={PAGE_NAME_MAX}
            required
            disabled={isSubmitting}
            error={errors.name_ar?.message}
            description={t("pageFormNameArHint")}
            {...form.register("name_ar")}
          />
        </div>
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline-danger"
            disabled={isSubmitting}
            onClick={() => onOpenChange(false)}
          >
            {t("pageFormCancel")}
          </Button>
          <Button
            type="submit"
            variant={role === "create" ? "success" : "default"}
            disabled={isSubmitting}
          >
            {role === "create" ? t("pageFormSubmit") : t("pageFormEditSubmit")}
          </Button>
        </div>
      </form>
    </AppDialog>
  );
}
