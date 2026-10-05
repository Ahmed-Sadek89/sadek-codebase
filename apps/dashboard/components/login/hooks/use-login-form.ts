"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useLogin } from "@repo/hooks/auth";
import { getApiErrorMessage } from "@repo/libs/axios";
import { loginSchema, type LoginValues } from "../schema/login";
import { LOGIN_DEFAULT_VALUES, LOGIN_REDIRECT_PATH } from "../utils/constants";

export function useLoginForm() {
  const router = useRouter();
  const login = useLogin();
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: LOGIN_DEFAULT_VALUES,
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const onSubmit = form.handleSubmit(async (values) => {
    form.clearErrors("root");
    try {
      await login.mutateAsync(values);
      router.push(LOGIN_REDIRECT_PATH);
    } catch (error) {
      form.setError("root.server", { message: getApiErrorMessage(error) });
    }
  });

  return { form, onSubmit, isPending: login.isPending || login.isSuccess };
}
