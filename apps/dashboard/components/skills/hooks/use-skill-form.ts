"use client";

import { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { showToast, toastApiError } from "@repo/libs/toast";
import { useCreateManySkills, useUpdateSkill } from "@repo/hooks/skills";
import type { Skill } from "@repo/types/skills";
import { createSkillSchema, type SkillFormInput, type SkillFormValues } from "../schema";
import { getDirection } from "../../../i18n/config";
import { SKILL_FORM_DEFAULT_VALUES } from "../utils/constants";

type UseSkillFormOptions = {
  /** The row being edited; null/undefined creates a new skill. */
  skill?: Skill | null;
  /** Runs after a successful save, e.g. to close the dialog. */
  onSuccess?: () => void;
};

export function useSkillForm({ skill = null, onSuccess }: UseSkillFormOptions = {}) {
  const t = useTranslations();
  const dir = getDirection(useLocale());
  const schema = useMemo(() => createSkillSchema(t), [t]);
  const form = useForm<SkillFormInput, unknown, SkillFormValues>({
    resolver: zodResolver(schema),
    defaultValues: SKILL_FORM_DEFAULT_VALUES,
    mode: "onBlur",
    reValidateMode: "onChange",
  });
  const createManySkills = useCreateManySkills();
  const updateSkill = useUpdateSkill();

  const onSubmit = form.handleSubmit(async ({ names, ...rest }) => {
    try {
      if (!skill) {
        // One request for every row; all saved or none.
        await createManySkills.mutateAsync({ names, ...rest });
        showToast({
          status: "success",
          title: t("skillsCreated", { count: names.length }),
          dir,
        });
      } else {
        // Editing has a single row.
        await updateSkill.mutateAsync({
          id: skill.id,
          data: { name: names[0], ...rest },
        });
        showToast({ status: "success", title: t("skillUpdated"), dir });
      }
      onSuccess?.();
    } catch (error) {
      toastApiError(error, { dir });
    }
  });

  return { form, onSubmit, isPending: form.formState.isSubmitting };
}
