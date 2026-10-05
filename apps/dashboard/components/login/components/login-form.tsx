"use client";

import { Button } from "@repo/ui/button";
import { BaseInput } from "../../../ui/forms/base-inputs";
import { useLoginForm } from "../hooks/use-login-form";
import { loginFields } from "../schema/login";

export function LoginForm() {
  const { form, onSubmit } = useLoginForm();
  const { errors, isSubmitting, isSubmitSuccessful } = form.formState;
  const isPending = isSubmitting || isSubmitSuccessful;

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="space-y-4"
      aria-busy={isPending}
    >
      {loginFields.map((field) => (
        <BaseInput
          key={field.name}
          id={field.name}
          label={field.label}
          type={field.type}
          placeholder={field.placeholder}
          autoComplete={field.autoComplete}
          required
          disabled={isPending}
          error={errors[field.name]?.message}
          {...form.register(field.name)}
        />
      ))}
      <Button type="submit" disabled={isPending} className="mt-2 h-11 w-full">
        {isPending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
