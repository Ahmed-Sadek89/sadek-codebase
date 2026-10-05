"use client";

import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
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
      className="space-y-5"
      aria-busy={isPending}
    >
      {loginFields.map((field) => {
        const error = errors[field.name];
        const errorId = `${field.name}-error`;

        return (
          <div key={field.name} className="space-y-2">
            <label htmlFor={field.name} className="text-sm font-medium">
              {field.label}
            </label>
            <Input
              id={field.name}
              type={field.type}
              placeholder={field.placeholder}
              autoComplete={field.autoComplete}
              required
              disabled={isPending}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? errorId : undefined}
              {...form.register(field.name)}
            />
            {error && (
              <p id={errorId} role="alert" className="text-sm text-danger">
                {error.message}
              </p>
            )}
          </div>
        );
      })}
      <Button type="submit" disabled={isPending} className="mt-2 h-11 w-full">
        {isPending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
