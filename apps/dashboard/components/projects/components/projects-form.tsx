"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Controller } from "react-hook-form";
import type { Project } from "@repo/types/projects";
import { Button } from "@repo/ui/button";
import { Eye, type LucideIcon } from "@repo/ui/icons";
import { AppDialog } from "../../ui/dialog";
import { BaseInput } from "../../ui/forms/base-input";
import { BaseTextarea } from "../../ui/forms/base-textarea";
import { BaseSwitch } from "../../ui/forms/base-switch";
import { BaseUpload } from "../../ui/forms/base-upload";
import { MultiSelectCategoryProjects } from "../../ui/forms/base-multi-select/multi-select-category-projects";
import { useProjectForm } from "../hooks/use-project-form";
import { toProjectFormInput } from "../utils/constants";
import { PROJECT_NAME_MAX, PROJECT_URL_MAX } from "../schema";

export type ProjectsFormProps = {
  isOpenDialog: boolean;
  handleOpenDialog: (open: boolean) => void;
  title: string;
  description?: string;
  Icon: LucideIcon;
  role?: "edit" | "create";
  /** The selected row when editing; its values fill the inputs. */
  defaultValues?: Project | null;
};

/**
 * Create/edit-project dialog: main image, English/Arabic names and
 * descriptions, live and repository links, categories, and an active switch.
 */
export function ProjectsForm({
  isOpenDialog,
  handleOpenDialog,
  title,
  description = "",
  Icon,
  role = "create",
  defaultValues = null,
}: ProjectsFormProps) {
  const t = useTranslations();
  const { form, onSubmit } = useProjectForm({
    project: defaultValues,
    onSuccess: () => handleOpenDialog(false),
  });
  const { errors, isSubmitting } = form.formState;

  // Fill the inputs each time the dialog opens: the selected row when
  // editing, blank when creating. Not on close, so fields don't flash empty
  // during the close animation.
  useEffect(() => {
    if (isOpenDialog) form.reset(toProjectFormInput(defaultValues));
  }, [isOpenDialog, defaultValues, form]);

  const onOpenChange = (open: boolean) => handleOpenDialog(open);

  return (
    <AppDialog
      open={isOpenDialog}
      onOpenChange={onOpenChange}
      className="sm:max-w-5xl max-h-[85dvh]! overflow-y-auto!"
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
          name="mainImageUrl"
          render={({ field, fieldState }) => (
            <BaseUpload
              id={field.name}
              label={t("projectFormImageLabel")}
              uploadType="image"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              validate={() => form.trigger("mainImageUrl")}
              disabled={isSubmitting}
              error={fieldState.error?.message}
            />
          )}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <BaseInput
            id="nameEn"
            label={t("projectFormNameEnLabel")}
            placeholder={t("projectFormNameEnPlaceholder")}
            dir="ltr"
            maxLength={PROJECT_NAME_MAX}
            required
            disabled={isSubmitting}
            error={errors.nameEn?.message}
            {...form.register("nameEn")}
          />
          <BaseInput
            id="nameAr"
            label={t("projectFormNameArLabel")}
            placeholder={t("projectFormNameArPlaceholder")}
            dir="rtl"
            maxLength={PROJECT_NAME_MAX}
            required
            disabled={isSubmitting}
            error={errors.nameAr?.message}
            {...form.register("nameAr")}
          />
          <BaseTextarea
            id="descriptionEn"
            label={t("projectFormDescriptionEnLabel")}
            placeholder={t("projectFormDescriptionEnPlaceholder")}
            dir="ltr"
            rows={4}
            required
            disabled={isSubmitting}
            error={errors.descriptionEn?.message}
            {...form.register("descriptionEn")}
          />
          <BaseTextarea
            id="descriptionAr"
            label={t("projectFormDescriptionArLabel")}
            placeholder={t("projectFormDescriptionArPlaceholder")}
            dir="rtl"
            rows={4}
            required
            disabled={isSubmitting}
            error={errors.descriptionAr?.message}
            {...form.register("descriptionAr")}
          />
          <BaseInput
            id="liveUrl"
            type="url"
            inputMode="url"
            label={t("projectFormLiveUrlLabel")}
            placeholder="https://"
            dir="ltr"
            maxLength={PROJECT_URL_MAX}
            disabled={isSubmitting}
            error={errors.liveUrl?.message}
            {...form.register("liveUrl")}
          />
          <BaseInput
            id="repoUrl"
            type="url"
            inputMode="url"
            label={t("projectFormRepoUrlLabel")}
            placeholder="https://github.com/"
            dir="ltr"
            maxLength={PROJECT_URL_MAX}
            disabled={isSubmitting}
            error={errors.repoUrl?.message}
            {...form.register("repoUrl")}
          />
        </div>
        <div className="grid items-end gap-4 sm:grid-cols-2">
          <Controller
            control={form.control}
            name="categoryProjects"
            render={({ field, fieldState }) => (
              <MultiSelectCategoryProjects
                id={field.name}
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
            name="isActive"
            render={({ field, fieldState }) => (
              <BaseSwitch
                id={field.name}
                label={t("projectFormActiveLabel")}
                description={t("projectFormActiveHint")}
                icon={<Eye className="size-4" />}
                checkedText={t("categorySkillFormActiveOn")}
                uncheckedText={t("categorySkillFormActiveOff")}
                checked={field.value}
                onCheckedChange={field.onChange}
                onBlur={field.onBlur}
                ref={field.ref}
                disabled={isSubmitting}
                error={fieldState.error?.message}
              />
            )}
          />
        </div>
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline-danger"
            disabled={isSubmitting}
            onClick={() => onOpenChange(false)}
          >
            {t("categorySkillFormCancel")}
          </Button>
          <Button
            type="submit"
            variant={role === "create" ? "success" : "default"}
            disabled={isSubmitting}
          >
            {role === "create"
              ? t("projectFormSubmit")
              : t("categorySkillFormEditSubmit")}
          </Button>
        </div>
      </form>
    </AppDialog>
  );
}
