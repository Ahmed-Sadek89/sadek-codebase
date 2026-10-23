"use client";

import { useTranslations } from "next-intl";
import { useWatch } from "react-hook-form";
import { Button } from "@repo/ui/button";
import { LoaderCircle, Send } from "@repo/ui/icons";
import { cn } from "@repo/ui/utils";
import { BaseInput, BaseTextarea } from "../../../../ui/forms";
import { useContactForm } from "../hooks";
import { CONTACT_LIMITS } from "../schema";

const fieldClass = "h-11 rounded-xl bg-background";

/** Message card: name, email, subject and message, posted to POST /contacts. */
export function ContactForm() {
  const t = useTranslations();
  const { form, onSubmit, isPending } = useContactForm();
  const {
    register,
    control,
    formState: { errors },
  } = form;
  const messageLength = useWatch({ control, name: "message" }).length;

  return (
    <div className="min-w-0 rounded-[2rem] border border-border bg-card p-6 shadow-2xl shadow-primary/10 sm:p-10">
      <h3 className="text-xl font-bold text-foreground sm:text-2xl">
        {t("contactFormTitle")}
      </h3>
      <p className="mt-1.5 text-sm text-muted-foreground">
        {t("contactFormCopy")}
      </p>
      {/* id="form": the "Start a Project" buttons link here. */}
      <form
        aria-busy={isPending}
        className="mt-5 grid gap-4 sm:mt-6 sm:grid-cols-2 sm:gap-5"
        id="form"
        noValidate
        onSubmit={onSubmit}
      >
        <BaseInput
          {...register("name")}
          autoComplete="name"
          className={fieldClass}
          disabled={isPending}
          error={errors.name?.message}
          label={t("contactNameLabel")}
          placeholder={t("contactNamePlaceholder")}
        />
        <BaseInput
          {...register("email")}
          autoComplete="email"
          className={fieldClass}
          dir="ltr"
          disabled={isPending}
          error={errors.email?.message}
          inputMode="email"
          label={t("contactEmailLabel")}
          placeholder={t("contactEmailPlaceholder")}
          type="email"
        />
        <BaseInput
          {...register("subject")}
          className={fieldClass}
          containerClassName="sm:col-span-2"
          disabled={isPending}
          error={errors.subject?.message}
          label={t("contactSubjectLabel")}
          placeholder={t("contactSubjectPlaceholder")}
        />
        <div className="sm:col-span-2">
          <BaseTextarea
            {...register("message")}
            aria-describedby="contact-message-count"
            className="min-h-32 resize-y rounded-xl bg-background sm:min-h-40"
            dir="auto"
            disabled={isPending}
            error={errors.message?.message}
            label={t("contactMessageLabel")}
            placeholder={t("contactMessagePlaceholder")}
            rows={6}
          />
          <p
            className={cn(
              "mt-1.5 text-end text-xs tabular-nums text-muted-foreground",
              messageLength > CONTACT_LIMITS.message && "text-danger",
            )}
            id="contact-message-count"
          >
            {t("contactCharCount", {
              count: messageLength,
              max: CONTACT_LIMITS.message,
            })}
          </p>
        </div>
        <Button
          className="h-12 w-full rounded-full px-8 text-sm shadow-lg shadow-primary/25 sm:col-span-2 sm:w-auto sm:justify-self-end"
          disabled={isPending}
          type="submit"
        >
          {isPending ? (
            <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
          ) : (
            <Send aria-hidden="true" className="size-4 rtl:-scale-x-100" />
          )}
          {isPending ? t("contactSending") : t("contactSend")}
        </Button>
      </form>
    </div>
  );
}
