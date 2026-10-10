import { z } from "zod";
import type { LoginRequest } from "@repo/types/auth";
import type { MessageKey } from "../../../i18n/types";

type Translate = (key: MessageKey) => string;

// Built per render so validation messages follow the active locale.
export const createLoginSchema = (t: Translate) =>
  z.object({
    email: z
      .string()
      .trim()
      .min(1, t("loginEmailRequired"))
      .pipe(z.email(t("loginEmailInvalid"))),
    password: z.string().min(1, t("loginPasswordRequired")),
  }) satisfies z.ZodType<LoginRequest>;

export type LoginValues = z.infer<ReturnType<typeof createLoginSchema>>;

export const loginFields = [
  {
    name: "email",
    labelKey: "loginEmailLabel",
    type: "email",
    placeholderKey: "loginEmailPlaceholder",
    autoComplete: "username",
  },
  {
    name: "password",
    labelKey: "loginPasswordLabel",
    type: "password",
    placeholderKey: "loginPasswordPlaceholder",
    autoComplete: "current-password",
  },
] as const;
