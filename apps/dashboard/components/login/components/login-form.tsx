"use client";

import { useTranslations } from "next-intl";
import { Button } from "@repo/ui/button";
import { useLoginForm } from "../hooks/use-login-form";
import { loginFields } from "../schema/login";
import { BaseInput } from "../../ui/forms/base-input";
import { PasswordInput } from "../../ui/forms/password-input";

export function LoginForm() {
  const t = useTranslations();
  const { form, onSubmit, isPending: isLoginPending } = useLoginForm();
  const { errors, isSubmitting } = form.formState;
  const isPending = isSubmitting || isLoginPending;

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="space-y-6"
      aria-busy={isPending}
    >
      <BaseInput
        key={loginFields[0].name}
        id={loginFields[0].name}
        label={t(loginFields[0].labelKey)}
        type={loginFields[0].type}
        placeholder={t(loginFields[0].placeholderKey)}
        autoComplete={loginFields[0].autoComplete}
        required
        disabled={isPending}
        error={errors[loginFields[0].name]?.message}
        {...form.register(loginFields[0].name)}
      />
      <PasswordInput
        key={loginFields[1].name}
        id={loginFields[1].name}
        label={t(loginFields[1].labelKey)}
        placeholder={t(loginFields[1].placeholderKey)}
        autoComplete={loginFields[1].autoComplete}
        required
        disabled={isPending}
        error={errors[loginFields[1].name]?.message}
        {...form.register(loginFields[1].name)}
      />
      {errors.root?.server?.message && (
        <p role="alert" className="text-sm text-danger">
          {errors.root.server.message}
        </p>
      )}
      <Button type="submit" disabled={isPending} className="mt-2 h-11 w-full">
        {isPending ? t("loginSubmitting") : t("loginSubmit")}
      </Button>
    </form>
  );
}
