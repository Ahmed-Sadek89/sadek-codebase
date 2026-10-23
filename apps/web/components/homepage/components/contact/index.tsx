"use client";

import { useTranslations } from "next-intl";
import type { UserInfoDetails } from "@repo/types/user-info";
import { SectionTitle } from "../../../ui/section-title";
import type { QueryState } from "../../utils";
import { ContactDetails, ContactForm } from "./components";
import { useContactDetails } from "./hooks";

export function Contact({
  userInfo,
}: {
  userInfo: QueryState<UserInfoDetails | undefined>;
}) {
  const t = useTranslations();
  const details = useContactDetails(userInfo.data);
  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="relative isolate overflow-hidden bg-muted py-[76px] max-[700px]:py-[54px]"
    >
      <div
        aria-hidden="true"
        className="absolute -start-32 bottom-0 -z-10 size-96 rounded-full bg-primary/10 blur-3xl"
      />
      <div className="app-container py-0">
        <SectionTitle
          id="contact-title"
          title={t("contactTitle")}
          copy={t("contactCopy")}
        />
        {/* Details beside the form on large screens; stacked below. */}
        <div className="mx-auto grid max-w-6xl items-start gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-8">
          <aside className="rounded-3xl border border-border bg-card/70 p-6 shadow-sm backdrop-blur sm:p-8">
            <h3 className="mb-5 text-lg font-bold text-foreground sm:text-xl">
              {t("contactInfoTitle")}
            </h3>
            <ContactDetails details={details} />
            <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-success/10 px-3 py-1.5 text-xs font-medium text-success">
              <span
                aria-hidden="true"
                className="size-1.5 rounded-full bg-success"
              />
              {t("contactReplyTime")}
            </p>
          </aside>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
