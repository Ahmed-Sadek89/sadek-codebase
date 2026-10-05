import { z } from "zod";
import type { LoginRequest } from "@repo/types/auth";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Enter your email address.")
    .pipe(z.email("Enter a valid email address.")),
  password: z.string().min(1, "Enter your password."),
}) satisfies z.ZodType<LoginRequest>;

export type LoginValues = z.infer<typeof loginSchema>;

export const loginFields = [
  {
    name: "email",
    label: "Email address",
    type: "email",
    placeholder: "you@example.com",
    autoComplete: "username",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "Enter your password",
    autoComplete: "current-password",
  },
] as const;
