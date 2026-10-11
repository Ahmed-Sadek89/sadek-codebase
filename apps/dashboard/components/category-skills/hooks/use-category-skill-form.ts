"use client";

import { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { getApiErrorMessage } from "@repo/libs/axios";
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
    form.clearErrors("root");
    try {
      if (category)
        await updateCategorySkill.mutateAsync({ id: category.id, data: values });
      else await createCategorySkill.mutateAsync(values);
      onSuccess?.();
    } catch (error) {
      form.setError("root.server", { message: getApiErrorMessage(error) });
    }
  });

  return { form, onSubmit, isPending: form.formState.isSubmitting };
}
