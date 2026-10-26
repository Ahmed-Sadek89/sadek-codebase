"use client";

import type { KeyboardEvent } from "react";
import { useTranslations } from "next-intl";
import { useWatch } from "react-hook-form";
import { Button } from "@repo/ui/button";
import { LoaderCircle, LockKeyhole, Send } from "@repo/ui/icons";
import { cn } from "@repo/ui/utils";
import { BaseInput, BaseTextarea } from "../../../../ui/forms";
import { useContactForm } from "../hooks";
import { CONTACT_LIMITS } from "../schema";
import { ContactSuccess } from "./contact-success";

const fieldClass = "h-11 rounded-xl bg-background";

/**
 * The form half of the contact card: name, email, subject and message,
 * posted to POST /contacts. After a send it shows ContactSuccess instead.
 */
export function ContactForm() {
  const t = useTranslations();
  const { form, onSubmit, isPending, sentTo, sendAnother } = useContactForm();
  const {
    register,
    control,
    setFocus,
    formState: { errors },
  } = form;
  const messageLength = useWatch({ control, name: "message" }).length;
  const isOverLimit = messageLength > CONTACT_LIMITS.message;

  // Ctrl/⌘ + Enter in the message sends the form.
  const onMessageKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      void onSubmit();
    }
  };

  return (
    // id="form": the "Start a Project" buttons link here; it stays while the thanks show.
    <div className="min-w-0 p-5   sm:p-8 lg:p-10" id="form">
      {sentTo ? (
        <ContactSuccess
          email={sentTo}
          onSendAnother={() => {
            sendAnother();
            // Wait for the form to mount again before focusing it.
            requestAnimationFrame(() => setFocus("name"));
          }}
        />
      ) : (
        <>
          <header className="mb-6 flex flex-wrap items-end justify-between gap-x-4 gap-y-1">
            <div>
              <h3 className="text-xl font-bold text-foreground sm:text-2xl">
                {t("contactFormTitle")}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">{t("contactFormCopy")}</p>
            </div>
            <p className="text-xs text-muted-foreground">{t("contactAllRequired")}</p>
          </header>
          <form
            aria-busy={isPending}
            className="grid gap-4 sm:grid-cols-2 sm:gap-5"
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
              maxLength={CONTACT_LIMITS.name}
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
              maxLength={CONTACT_LIMITS.email}
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
              maxLength={CONTACT_LIMITS.subject}
              placeholder={t("contactSubjectPlaceholder")}
            />
            <div className="sm:col-span-2">
              <BaseTextarea
                {...register("message")}
                aria-describedby="contact-message-hint"
                className="min-h-36 resize-y rounded-xl bg-background sm:min-h-44"
                dir="auto"
                disabled={isPending}
                error={errors.message?.message}
                label={t("contactMessageLabel")}
                onKeyDown={onMessageKeyDown}
                placeholder={t("contactMessagePlaceholder")}
                rows={6}
              />
              <p
                className="mt-1.5 flex items-center justify-between gap-3 text-xs text-muted-foreground"
                id="contact-message-hint"
              >
                {/* Only where there is a physical keyboard. */}
                <span className="hidden [@media(hover:hover)]:inline">
                  {t("contactShortcut")}
                </span>
                <span
                  className={cn(
                    "ms-auto tabular-nums",
                    isOverLimit && "font-semibold text-danger",
                  )}
                >
                  {t("contactCharCount", {
                    count: messageLength,
                    max: CONTACT_LIMITS.message,
                  })}
                </span>
              </p>
            </div>
            <div className="flex flex-col-reverse gap-4 border-t border-border pt-5 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground sm:max-w-xs">
                <LockKeyhole aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
                {t("contactPrivacy")}
              </p>
              <Button
                className="h-12 w-full shrink-0 rounded-full px-8 text-sm shadow-lg shadow-primary/25 sm:w-auto"
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
            </div>
          </form>
        </>
      )}
    </div>
  );
}
