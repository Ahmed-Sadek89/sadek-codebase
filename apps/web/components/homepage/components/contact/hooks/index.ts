"use client";

import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import type { UserInfoDetails } from "@repo/types/user-info";
import { useCreateContact } from "@repo/hooks/contacts";
import { toastApiError } from "@repo/libs/toast";
import { getDirection } from "../../../../../i18n/config";
import { createContactSchema, type ContactFormValues } from "../schema";
import { CONTACT_FORM_DEFAULT_VALUES, getContactDetails } from "../utils";

export function useContactDetails(info: UserInfoDetails | undefined) {
  return useMemo(() => (info ? getContactDetails(info) : []), [info]);
}

/**
 * The contact form: React Hook Form + Zod, sent with POST /contacts. On
 * success the form clears and `sentTo` holds the visitor's email, so the card
 * can show a thank-you in place of the form until `sendAnother()`. A failure
 * shows the API's message as an error toast and keeps what they typed.
 */
export function useContactForm() {
  const t = useTranslations();
  const dir = getDirection(useLocale());
  const schema = useMemo(() => createContactSchema(t), [t]);
  const createContact = useCreateContact();
  const [sentTo, setSentTo] = useState<string | null>(null);
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(schema),
    defaultValues: CONTACT_FORM_DEFAULT_VALUES,
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await createContact.mutateAsync(values);
      form.reset(CONTACT_FORM_DEFAULT_VALUES);
      setSentTo(values.email);
    } catch (error) {
      toastApiError(error, { dir });
    }
  });

  const sendAnother = () => setSentTo(null);

  return {
    form,
    onSubmit,
    isPending: form.formState.isSubmitting,
    sentTo,
    sendAnother,
  };
}
