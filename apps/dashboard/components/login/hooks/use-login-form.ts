"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { getApiErrorMessage } from "@repo/libs/axios";
import { loginSchema, type LoginValues } from "../schema/login";
import { LOGIN_DEFAULT_VALUES, LOGIN_REDIRECT_PATH } from "../utils/constants";

export function useLoginForm() {
  const router = useRouter();
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: LOGIN_DEFAULT_VALUES,
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const onSubmit = form.handleSubmit(async (values) => {
    form.clearErrors("root");
    try {
      const result = await signIn("credentials", {
        ...values,
        redirect: false,
      });
      if (!result || result.error || !result.ok)
        throw new Error(
          "Sign in failed. Check your credentials and try again.",
        );
      router.push(LOGIN_REDIRECT_PATH);
    } catch (error) {
      form.setError("root.server", {
        message:
          error instanceof Error ? error.message : getApiErrorMessage(error),
      });
    }
  });

  return { form, onSubmit, isPending: form.formState.isSubmitting };
}
