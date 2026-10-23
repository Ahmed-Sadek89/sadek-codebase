"use client";

import { useTranslations } from "next-intl";
import type { UserInfoDetails } from "@repo/types/user-info";
import { SectionTitle } from "../../../ui/section-title";
import type { QueryState } from "../../utils";
import { ContactForm, ContactInfoPanel } from "./components";
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
      className="relative isolate overflow-hidden bg-muted py-14 sm:py-20 lg:py-24"
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
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-8">
          <ContactInfoPanel details={details} />
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
