"use client";

import { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { showToast, toastApiError } from "@repo/libs/toast";
import {
  useCreateCategorySkill,
  useUpdateCategorySkill,
} from "@repo/hooks/category-skills";
import type { CategorySkill } from "@repo/types/category-skills";
import {
  createCategorySkillSchema,
  type CategorySkillFormInput,
  type CategorySkillFormValues,
} from "../schema";
import { getDirection } from "../../../i18n/config";
import { CATEGORY_SKILL_FORM_DEFAULT_VALUES } from "../utils/constants";

type UseCategorySkillFormOptions = {
  /** The row being edited; null/undefined creates a new category. */
  category?: CategorySkill | null;
  /** Runs after a successful save, e.g. to close the dialog. */
  onSuccess?: () => void;
};

export function useCategorySkillForm({
  category = null,
  onSuccess,
}: UseCategorySkillFormOptions = {}) {
  const t = useTranslations();
  const dir = getDirection(useLocale());
  const schema = useMemo(() => createCategorySkillSchema(t), [t]);
  const form = useForm<CategorySkillFormInput, unknown, CategorySkillFormValues>(
    {
      resolver: zodResolver(schema),
      defaultValues: CATEGORY_SKILL_FORM_DEFAULT_VALUES,
      mode: "onBlur",
      reValidateMode: "onChange",
    },
  );
  const createCategorySkill = useCreateCategorySkill();
  const updateCategorySkill = useUpdateCategorySkill();

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      if (category) {
        await updateCategorySkill.mutateAsync({ id: category.id, data: values });
        showToast({ status: "success", title: t("categorySkillUpdated"), dir });
      } else {
        await createCategorySkill.mutateAsync(values);
        showToast({ status: "success", title: t("categorySkillCreated"), dir });
      }
      onSuccess?.();
    } catch (error) {
      toastApiError(error, { dir });
    }
  });

  return { form, onSubmit, isPending: form.formState.isSubmitting };
}
