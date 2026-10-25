"use client";

import { useLocale, useTranslations } from "next-intl";
import type { ProjectDetails } from "@repo/types/projects";
import { ConfirmAction } from "../../ui/confirm-action";
import { useProjectForm } from "../../projects/hooks/use-project-form";
import { ProjectImageField } from "../../projects/components/project-image-field";
import { ProjectTextFields } from "../../projects/components/project-text-fields";
import { ProjectDescriptionFields } from "../../projects/components/project-description-fields";
import { ProjectLinkFields } from "../../projects/components/project-link-fields";
import {
  ProjectActiveField,
  ProjectCategoriesField,
} from "../../projects/components/project-settings-fields";
import { localized } from "../../../utils/format";
import { useRouter } from "../../../i18n/navigation";
import { useLeaveGuard } from "../hooks/use-leave-guard";
import { FormCard } from "./form-card";
import { FormHeader } from "./form-header";

const PROJECTS_HREF = "/dashboard/projects";

/**
 * The create/edit project page: a sticky action bar, the texts in the main
 * column (basics, then the rich-text descriptions) and a sticky side panel
 * (cover image, visibility, categories, links). Stacks on small screens.
 */
export function ProjectForm({ project }: { project: ProjectDetails | null }) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const isCreate = project === null;
  const { form, onSubmit } = useProjectForm({
    project,
    onSuccess: () => router.push(PROJECTS_HREF),
  });
  const { isSubmitting, isDirty } = form.formState;
  const leaveGuard = useLeaveGuard(isDirty && !isSubmitting);
  const fieldProps = { form, disabled: isSubmitting };

  return (
    <>
      <form
        id="project-form"
        onSubmit={onSubmit}
        noValidate
        aria-busy={isSubmitting}
        className="space-y-6"
      >
        <FormHeader
          isCreate={isCreate}
          subtitle={
            project
              ? localized(locale, project.nameEn, project.nameAr)
              : t("projectFormDescription")
          }
          isSubmitting={isSubmitting}
          onLeave={() => leaveGuard.requestLeave(PROJECTS_HREF)}
        />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="min-w-0 space-y-6">
            <FormCard
              title={t("projectFormSectionBasics")}
              description={t("projectFormSectionBasicsHint")}
              contentClassName="grid gap-4 space-y-0 sm:grid-cols-2"
            >
              <ProjectTextFields {...fieldProps} />
            </FormCard>
            <FormCard
              title={t("projectFormSectionDescription")}
              description={t("projectFormSectionDescriptionHint")}
              contentClassName="space-y-6"
            >
              <ProjectDescriptionFields {...fieldProps} />
            </FormCard>
          </div>

          {/* Sticks below the dashboard header and the action bar. */}
          <aside className="min-w-0 space-y-6 self-start lg:sticky lg:top-40">
            <FormCard title={t("projectFormSectionImage")}>
              <ProjectImageField {...fieldProps} />
            </FormCard>
            <FormCard title={t("projectFormSectionVisibility")}>
              <ProjectActiveField {...fieldProps} />
            </FormCard>
            <FormCard title={t("projectFormSectionCategories")}>
              <ProjectCategoriesField {...fieldProps} />
            </FormCard>
            <FormCard title={t("projectFormSectionLinks")}>
              <ProjectLinkFields {...fieldProps} />
            </FormCard>
          </aside>
        </div>
      </form>
      <ConfirmAction
        open={leaveGuard.isConfirmOpen}
        onOpenChange={leaveGuard.onConfirmOpenChange}
        question={t("projectFormDiscardQuestion")}
        onConfirm={leaveGuard.confirmLeave}
      />
    </>
  );
}
