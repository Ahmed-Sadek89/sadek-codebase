"use client";

import { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { showToast, toastApiError } from "@repo/libs/toast";
import { useChangePassword } from "@repo/hooks/auth";
import { getDirection } from "../../../i18n/config";
import {
  createChangePasswordSchema,
  type ChangePasswordFormValues,
} from "../schema";

export const CHANGE_PASSWORD_DEFAULT_VALUES: ChangePasswordFormValues = {
  password: "",
  newPassword: "",
  confirmPassword: "",
};

type UseChangePasswordFormOptions = {
  /** The signed-in user's email; the backend checks the current password against it. */
  email: string;
  /** Runs after a successful change, e.g. to close the dialog. */
  onSuccess?: () => void;
};

export function useChangePasswordForm({
  email,
  onSuccess,
}: UseChangePasswordFormOptions) {
  const t = useTranslations();
  const dir = getDirection(useLocale());
  const schema = useMemo(() => createChangePasswordSchema(t), [t]);
  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(schema),
    defaultValues: CHANGE_PASSWORD_DEFAULT_VALUES,
    mode: "onBlur",
    reValidateMode: "onChange",
  });
  const changePassword = useChangePassword();

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await changePassword.mutateAsync({ email, ...values });
      showToast({ status: "success", title: t("profilePasswordChanged"), dir });
      onSuccess?.();
    } catch (error) {
      toastApiError(error, { dir });
    }
  });

  return { form, onSubmit, isPending: form.formState.isSubmitting };
}
