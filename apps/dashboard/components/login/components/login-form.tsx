"use client";

import { Button } from "@repo/ui/button";
import { useLoginForm } from "../hooks/use-login-form";
import { loginFields } from "../schema/login";
import { BaseInput } from "../../ui/forms/base-input";
import { PasswordInput } from "../../ui/forms/password-input";

export function LoginForm() {
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
        label={loginFields[0].label}
        type={loginFields[0].type}
        placeholder={loginFields[0].placeholder}
        autoComplete={loginFields[0].autoComplete}
        required
        disabled={isPending}
        error={errors[loginFields[0].name]?.message}
        {...form.register(loginFields[0].name)}
      />
      <PasswordInput
        key={loginFields[1].name}
        id={loginFields[1].name}
        label={loginFields[1].label}
        placeholder={loginFields[1].placeholder}
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
        {isPending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
