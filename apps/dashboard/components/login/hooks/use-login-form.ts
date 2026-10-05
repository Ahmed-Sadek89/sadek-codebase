"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { loginSchema, type LoginValues } from "../schema/login";
import { LOGIN_DEFAULT_VALUES, LOGIN_REDIRECT_PATH } from "../utils/constants";

export function useLoginForm() {
  const router = useRouter();
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: LOGIN_DEFAULT_VALUES,
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const onSubmit = form.handleSubmit(() => {
    // Authentication is a placeholder; only validated forms can navigate.
    router.push(LOGIN_REDIRECT_PATH);
  });

  return { form, onSubmit };
}
