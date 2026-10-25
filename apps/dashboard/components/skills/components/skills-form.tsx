"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Controller, useWatch } from "react-hook-form";
import type { Skill } from "@repo/types/skills";
import { Button } from "@repo/ui/button";
import { Eye, type LucideIcon } from "@repo/ui/icons";
import { AppDialog } from "../../ui/dialog";
import { BaseSwitch } from "../../ui/forms/base-switch";
import { useSkillForm } from "../hooks/use-skill-form";
import { toSkillFormInput } from "../utils/constants";
import { SkillNamesField } from "./skill-names-field";
import { MultiSelectCategorySkills } from "../../ui/forms/base-multi-select/multi-select-category-skills";

export type SkillsFormProps = {
  isOpenDialog: boolean;
  handleOpenDialog: (open: boolean) => void;
  title: string;
  description?: string;
  Icon: LucideIcon;
  role?: "edit" | "create";
  /** The selected row when editing; its values fill the inputs. */
  defaultValues?: Skill | null;
};

/**
 * Create/edit-skill dialog. Creating takes one or more names that share the
 * same categories and active switch; editing changes one skill.
 */
export function SkillsForm({
  isOpenDialog,
  handleOpenDialog,
  title,
  description = "",
  Icon,
  role = "create",
  defaultValues = null,
}: SkillsFormProps) {
  const t = useTranslations();
  const { form, onSubmit } = useSkillForm({
    skill: defaultValues,
    onSuccess: () => handleOpenDialog(false),
  });
  const { isSubmitting } = form.formState;
  const nameCount = useWatch({ control: form.control, name: "names" }).length;

  // Fill the inputs each time the dialog opens: the selected row when
  // editing, blank when creating. Not on close, so fields don't flash empty
  // during the close animation.
  useEffect(() => {
    if (isOpenDialog) form.reset(toSkillFormInput(defaultValues));
  }, [isOpenDialog, defaultValues, form]);

  const onOpenChange = (open: boolean) => handleOpenDialog(open);

  return (
    <AppDialog
      open={isOpenDialog}
      onOpenChange={onOpenChange}
      className="sm:max-w-5xl"
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
        <SkillNamesField
          form={form}
          disabled={isSubmitting}
          multiple={role === "create"}
        />
        <div className="grid gap-4 sm:grid-cols-2 items-end">

          <Controller
            control={form.control}
            name="categorySkills"
            render={({ field, fieldState }) => (
              <MultiSelectCategorySkills
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
                label={t("skillFormActiveLabel")}
                description={t("skillFormActiveHint")}
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
              ? t("skillFormSubmit", { count: nameCount })
              : t("categorySkillFormEditSubmit")}
          </Button>
        </div>
      </form>
    </AppDialog>
  );
}
