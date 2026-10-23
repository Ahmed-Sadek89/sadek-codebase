"use client";

import { useTranslations } from "next-intl";
import type { UserInfoDetails } from "@repo/types/user-info";
import { Send } from "@repo/ui/icons";
import { Button } from "@repo/ui/button";
import { SectionTitle } from "../../../ui/section-title";
import type { QueryState } from "../../utils";
import { ContactDetails } from "./components";
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
      className="py-[76px] max-[700px]:py-[54px] bg-muted"
    >
      <div className="app-container py-0">
        <SectionTitle
          id="contact-title"
          title={t("contactTitle")}
          copy={t("contactCopy")}
        />
        <ContactDetails details={details} />
        <form
          className="mx-auto grid max-w-[560px] grid-cols-2 gap-2 rounded-[7px] bg-card p-4"
          id="form"
        >
          <input
            className="rounded-[3px] border border-input bg-background p-2.5 font-[inherit] text-[10px] text-foreground"
            placeholder={t("contactNamePlaceholder")}
          />
          <input
            className="rounded-[3px] border border-input bg-background p-2.5 font-[inherit] text-[10px] text-foreground"
            placeholder={t("contactEmailPlaceholder")}
          />
          <input
            className="col-span-2 rounded-[3px] border border-input bg-background p-2.5 font-[inherit] text-[10px] text-foreground"
            placeholder={t("contactSubjectPlaceholder")}
          />
          <textarea
            className="col-span-2 resize-y rounded-[3px] border border-input bg-background p-2.5 font-[inherit] text-[10px] text-foreground"
            placeholder={t("contactMessagePlaceholder")}
            rows={5}
          />
          <Button
            className="col-span-2 justify-self-center text-[10px]"
            type="submit"
          >
            {t("contactSend")} <Send className="rtl:-scale-x-100" />
          </Button>
        </form>
      </div>
    </section>
  );
}
