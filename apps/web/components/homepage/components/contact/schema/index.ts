import { z } from "zod";
import {
  CONTACT_EMAIL_MAX,
  CONTACT_MESSAGE_MAX,
  CONTACT_NAME_MAX,
  CONTACT_SUBJECT_MAX,
} from "@repo/constants/contacts";
import type { CreateContactRequest } from "@repo/types/contacts";
import type { MessageKey } from "../../../../../i18n/types";

type Translate = (key: MessageKey, values?: { max: number }) => string;

/** Limits of POST /contacts, shared with CreateContactDto. */
export const CONTACT_LIMITS = {
  name: CONTACT_NAME_MAX,
  email: CONTACT_EMAIL_MAX,
  subject: CONTACT_SUBJECT_MAX,
  message: CONTACT_MESSAGE_MAX,
} as const;

// Built per render so validation messages follow the active locale.
export const createContactSchema = (t: Translate) => {
  const tooLong = (max: number) => t("contactTooLong", { max });
  return z.object({
    name: z
      .string()
      .trim()
      .min(1, t("contactNameRequired"))
      .max(CONTACT_LIMITS.name, tooLong(CONTACT_LIMITS.name)),
    email: z
      .string()
      .trim()
      .min(1, t("contactEmailRequired"))
      .max(CONTACT_LIMITS.email, tooLong(CONTACT_LIMITS.email))
      .pipe(z.email(t("contactEmailInvalid"))),
    subject: z
      .string()
      .trim()
      .min(1, t("contactSubjectRequired"))
      .max(CONTACT_LIMITS.subject, tooLong(CONTACT_LIMITS.subject)),
    message: z
      .string()
      .trim()
      .min(1, t("contactMessageRequired"))
      .max(CONTACT_LIMITS.message, tooLong(CONTACT_LIMITS.message)),
  }) satisfies z.ZodType<CreateContactRequest>;
};

export type ContactFormValues = z.infer<ReturnType<typeof createContactSchema>>;
