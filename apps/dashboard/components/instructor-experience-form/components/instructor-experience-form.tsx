"use client";

import { useTranslations } from "next-intl";
import type { InstructorExperience } from "@repo/types/instructor-experience";
import { ConfirmAction } from "../../ui/confirm-action";
import { useRouter } from "../../../i18n/navigation";
import { useLeaveGuard } from "../../project-form/hooks/use-leave-guard";
import { FormCard } from "../../project-form/components/form-card";
import { useInstructorExperienceForm } from "../../instructor-experience/hooks/use-instructor-experience-form";
import { CourseFields } from "../../instructor-experience/components/course-fields";
import { PeriodFields } from "../../instructor-experience/components/period-fields";
import { DescriptionFields } from "../../instructor-experience/components/description-fields";
import {
  ActiveField,
  CoverPhotoField,
  RankField,
  SkillsField,
} from "../../instructor-experience/components/settings-fields";
import { INSTRUCTOR_EXPERIENCES_HREF } from "../../instructor-experience/utils/constants";
import { FormHeader } from "./form-header";

/**
 * The create/edit page: a sticky action bar, the course, period and
 * descriptions in the main column, and a sticky side panel (cover photo,
 * visibility, skills). Stacks on small screens.
 */
export function InstructorExperienceForm({
  instructorExperience,
}: {
  instructorExperience: InstructorExperience | null;
}) {
  const t = useTranslations();
  const router = useRouter();
  const isCreate = instructorExperience === null;
  const { form, onSubmit } = useInstructorExperienceForm({
    instructorExperience,
    onSuccess: () => router.push(INSTRUCTOR_EXPERIENCES_HREF),
  });
  const { isSubmitting, isDirty } = form.formState;
  const leaveGuard = useLeaveGuard(isDirty && !isSubmitting);
  const fieldProps = { form, disabled: isSubmitting };

  return (
    <>
      <form
        id="instructor-experience-form"
        onSubmit={onSubmit}
        noValidate
        aria-busy={isSubmitting}
        className="space-y-6"
      >
        <FormHeader
          isCreate={isCreate}
          subtitle={instructorExperience?.name ?? t("instructorExperienceFormDescription")}
          isSubmitting={isSubmitting}
          onLeave={() => leaveGuard.requestLeave(INSTRUCTOR_EXPERIENCES_HREF)}
        />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="min-w-0 space-y-6">
            <FormCard
              title={t("instructorExperienceFormSectionCourse")}
              description={t("instructorExperienceFormSectionCourseHint")}
              contentClassName="grid gap-4 space-y-0 sm:grid-cols-2"
            >
              <CourseFields {...fieldProps} />
            </FormCard>
            <FormCard
              title={t("instructorExperienceFormSectionPeriod")}
              description={t("instructorExperienceFormSectionPeriodHint")}
              contentClassName="grid gap-4 space-y-0 sm:grid-cols-2"
            >
              <PeriodFields {...fieldProps} />
            </FormCard>
            <FormCard
              title={t("instructorExperienceFormSectionDescription")}
              description={t("instructorExperienceFormSectionDescriptionHint")}
              contentClassName="space-y-6"
            >
              <DescriptionFields {...fieldProps} />
            </FormCard>
          </div>

          {/* Sticks below the dashboard header and the action bar. */}
          <aside className="min-w-0 space-y-6 self-start lg:sticky lg:top-40">
            <FormCard title={t("instructorExperienceFormSectionCover")}>
              <CoverPhotoField {...fieldProps} />
            </FormCard>
            <FormCard title={t("instructorExperienceFormSectionSkills")}>
              <SkillsField {...fieldProps} />
            </FormCard>
            <FormCard title={t("projectFormSectionVisibility")}>
              <ActiveField {...fieldProps} />
              <RankField {...fieldProps} />
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
