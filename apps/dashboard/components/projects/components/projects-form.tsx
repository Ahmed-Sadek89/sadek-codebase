"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import type { Project } from "@repo/types/projects";
import { Button } from "@repo/ui/button";
import type { LucideIcon } from "@repo/ui/icons";
import { AppDialog } from "../../ui/dialog";
import { useProjectForm } from "../hooks/use-project-form";
import { toProjectFormInput } from "../utils/constants";
import { ProjectImageField } from "./project-image-field";
import { ProjectLinkFields } from "./project-link-fields";
import { ProjectSettingsFields } from "./project-settings-fields";
import { ProjectTextFields } from "./project-text-fields";

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
  const { isSubmitting } = form.formState;

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
        <ProjectImageField form={form} disabled={isSubmitting} />
        <div className="grid gap-4 sm:grid-cols-2">
          <ProjectTextFields form={form} disabled={isSubmitting} />
          <ProjectLinkFields form={form} disabled={isSubmitting} />
        </div>
        <ProjectSettingsFields form={form} disabled={isSubmitting} />
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
