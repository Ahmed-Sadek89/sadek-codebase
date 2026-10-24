"use client";

import { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { showToast, toastApiError } from "@repo/libs/toast";
import { useCreatePage, useUpdatePage } from "@repo/hooks/pages";
import type { Page } from "@repo/types/pages";
import {
  createPageSchema,
  type PageFormInput,
  type PageFormValues,
} from "../schema";
import { getDirection } from "../../../i18n/config";
import { PAGE_FORM_DEFAULT_VALUES } from "../utils/constants";

type UsePageFormOptions = {
  /** The row being edited; null/undefined creates a new page. */
  page?: Page | null;
  /** Runs after a successful save, e.g. to close the dialog. */
  onSuccess?: () => void;
};

export function usePageForm({ page = null, onSuccess }: UsePageFormOptions = {}) {
  const t = useTranslations();
  const dir = getDirection(useLocale());
  const schema = useMemo(() => createPageSchema(t), [t]);
  const form = useForm<PageFormInput, unknown, PageFormValues>({
    resolver: zodResolver(schema),
    defaultValues: PAGE_FORM_DEFAULT_VALUES,
    mode: "onBlur",
    reValidateMode: "onChange",
  });
  const createPage = useCreatePage();
  const updatePage = useUpdatePage();

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      if (page) {
        await updatePage.mutateAsync({ id: page.id, data: values });
        showToast({ status: "success", title: t("pageUpdated"), dir });
      } else {
        await createPage.mutateAsync(values);
        showToast({ status: "success", title: t("pageCreated"), dir });
      }
      onSuccess?.();
    } catch (error) {
      // A taken name comes back as 409 with the backend's message.
      toastApiError(error, { dir });
    }
  });

  return { form, onSubmit, isPending: form.formState.isSubmitting };
}
