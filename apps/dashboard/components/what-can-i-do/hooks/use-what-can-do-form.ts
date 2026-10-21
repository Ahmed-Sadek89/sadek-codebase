"use client";

import { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { showToast, toastApiError } from "@repo/libs/toast";
import {
  useCreateWhatCanDo,
  useUpdateWhatCanDo,
} from "@repo/hooks/what-can-do";
import type { WhatCanDoDetails } from "@repo/types/what-can-do";
import {
  createWhatCanDoSchema,
  type WhatCanDoFormInput,
  type WhatCanDoFormValues,
} from "../schema";
import { getDirection } from "../../../i18n/config";
import { WHAT_CAN_DO_FORM_DEFAULT_VALUES } from "../utils/constants";

type UseWhatCanDoFormOptions = {
  /** The row being edited; null/undefined creates a new item. */
  item?: WhatCanDoDetails | null;
  /** Runs after a successful save, e.g. to close the dialog. */
  onSuccess?: () => void;
};

export function useWhatCanDoForm({
  item = null,
  onSuccess,
}: UseWhatCanDoFormOptions = {}) {
  const t = useTranslations();
  const dir = getDirection(useLocale());
  const schema = useMemo(() => createWhatCanDoSchema(t), [t]);
  const form = useForm<WhatCanDoFormInput, unknown, WhatCanDoFormValues>({
    resolver: zodResolver(schema),
    defaultValues: WHAT_CAN_DO_FORM_DEFAULT_VALUES,
    mode: "onBlur",
    reValidateMode: "onChange",
  });
  const createWhatCanDo = useCreateWhatCanDo();
  const updateWhatCanDo = useUpdateWhatCanDo();

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      if (item) {
        // An emptied optional text is cleared with null (omitting it would
        // keep the saved value).
        const clear = (value: string | undefined, saved: string | null) =>
          value ?? (saved ? null : undefined);
        await updateWhatCanDo.mutateAsync({
          id: item.id,
          data: {
            ...values,
            title_ar: clear(values.title_ar, item.title_ar),
            shortDescription_en: clear(
              values.shortDescription_en,
              item.shortDescription_en,
            ),
            shortDescription_ar: clear(
              values.shortDescription_ar,
              item.shortDescription_ar,
            ),
            description_en: clear(values.description_en, item.description_en),
            description_ar: clear(values.description_ar, item.description_ar),
          },
        });
        showToast({ status: "success", title: t("whatCanDoUpdated"), dir });
      } else {
        await createWhatCanDo.mutateAsync(values);
        showToast({ status: "success", title: t("whatCanDoCreated"), dir });
      }
      onSuccess?.();
    } catch (error) {
      toastApiError(error, { dir });
    }
  });

  return { form, onSubmit, isPending: form.formState.isSubmitting };
}
