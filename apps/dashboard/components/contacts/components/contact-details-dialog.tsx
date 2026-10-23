"use client";

import { useFormatter, useTranslations } from "next-intl";
import type { Contact } from "@repo/types/contacts";
import { buttonVariants } from "@repo/ui/button";
import {
  CalendarDays,
  Mail,
  MessageSquare,
  Reply,
  UserRound,
} from "@repo/ui/icons";
import { AppDialog } from "../../ui/dialog";

/** The full message of one contact, opened from the table's View action. */
export function ContactDetailsDialog({
  contact,
  open,
  onOpenChange,
}: {
  /** Kept while closing so the content doesn't vanish during the animation. */
  contact: Contact | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const t = useTranslations();
  const format = useFormatter();
  if (!contact) return null;
  const replyHref = `mailto:${contact.email}?subject=${encodeURIComponent(`Re: ${contact.subject}`)}`;
  return (
    <AppDialog
      Icon={MessageSquare}
      className="sm:max-w-2xl"
      description={t("contactDetailsDescription")}
      onOpenChange={onOpenChange}
      open={open}
      title={contact.subject}
    >
      <dl className="grid gap-3 rounded-xl border border-border bg-muted/40 p-4 text-sm sm:grid-cols-3">
        <div className="flex items-center gap-2">
          <UserRound
            aria-hidden="true"
            className="size-4 shrink-0 text-primary"
          />
          <dt className="sr-only">{t("tableColSender")}</dt>
          <dd className="truncate font-semibold">{contact.name}</dd>
        </div>
        <div className="flex items-center gap-2">
          <Mail aria-hidden="true" className="size-4 shrink-0 text-primary" />
          <dt className="sr-only">{t("contactDetailsEmail")}</dt>
          <dd className="truncate">
            <a
              className="text-muted-foreground hover:text-primary hover:underline"
              dir="ltr"
              href={`mailto:${contact.email}`}
            >
              {contact.email}
            </a>
          </dd>
        </div>
        <div className="flex items-center gap-2">
          <CalendarDays
            aria-hidden="true"
            className="size-4 shrink-0 text-primary"
          />
          <dt className="sr-only">{t("tableColReceivedAt")}</dt>
          <dd className="text-muted-foreground">
            {format.dateTime(new Date(contact.createdAt), {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </dd>
        </div>
      </dl>
      {/* dir="auto": the message may be Arabic or English whatever the UI language. */}
      <p
        className="mt-4 max-h-[50dvh] overflow-y-auto rounded-xl border border-border p-4 text-sm leading-relaxed whitespace-pre-line text-foreground"
        dir="auto"
      >
        {contact.message}
      </p>
      <div className="mt-4 flex justify-end">
        <a className={buttonVariants({ className: "gap-2" })} href={replyHref}>
          <Reply aria-hidden="true" className="size-4 rtl:-scale-x-100" />
          {t("contactDetailsReply")}
        </a>
      </div>
    </AppDialog>
  );
}
