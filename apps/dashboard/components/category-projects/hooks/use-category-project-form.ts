"use client";

import { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { showToast, toastApiError } from "@repo/libs/toast";
import {
  useCreateCategoryProject,
  useUpdateCategoryProject,
} from "@repo/hooks/category-projects";
import type { CategoryProject } from "@repo/types/category-projects";
import {
  createCategoryProjectSchema,
  type CategoryProjectFormInput,
  type CategoryProjectFormValues,
} from "../schema";
import { getDirection } from "../../../i18n/config";
import { CATEGORY_PROJECT_FORM_DEFAULT_VALUES } from "../utils/constants";

type UseCategoryProjectFormOptions = {
  /** The row being edited; null/undefined creates a new category. */
  category?: CategoryProject | null;
  /** Runs after a successful save, e.g. to close the dialog. */
  onSuccess?: () => void;
};

export function useCategoryProjectForm({
  category = null,
  onSuccess,
}: UseCategoryProjectFormOptions = {}) {
  const t = useTranslations();
  const dir = getDirection(useLocale());
  const schema = useMemo(() => createCategoryProjectSchema(t), [t]);
  const form = useForm<CategoryProjectFormInput, unknown, CategoryProjectFormValues>(
    {
      resolver: zodResolver(schema),
      defaultValues: CATEGORY_PROJECT_FORM_DEFAULT_VALUES,
      mode: "onBlur",
      reValidateMode: "onChange",
    },
  );
  const createCategoryProject = useCreateCategoryProject();
  const updateCategoryProject = useUpdateCategoryProject();

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      if (category) {
        await updateCategoryProject.mutateAsync({ id: category.id, data: values });
        showToast({ status: "success", title: t("categoryProjectUpdated"), dir });
      } else {
        await createCategoryProject.mutateAsync(values);
        showToast({ status: "success", title: t("categoryProjectCreated"), dir });
      }
      onSuccess?.();
    } catch (error) {
      toastApiError(error, { dir });
    }
  });

  return { form, onSubmit, isPending: form.formState.isSubmitting };
}
