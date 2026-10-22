"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import type { UserInfoDetails } from "@repo/types/user-info";
import { ArrowRight, Send } from "@repo/ui/icons";
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
    <>
      <section className="py-[76px] max-[700px]:py-[54px] text-center bg-background bg-radial-[circle_at_center] from-primary-muted from-0% to-transparent to-35%">
        <div className="app-container py-0">
          <span className="text-[10px] tracking-[0.12em] text-primary font-extrabold">
            {t("contactEyebrow")}
          </span>
          <h2 className="m-[7px] text-[26px]">{t("contactHeading")}</h2>
          <p className="mx-auto mb-[18px] max-w-[480px] text-[11px] leading-[1.6] text-muted-foreground">
            {t("contactBody")}
          </p>
          <Button asChild>
            <Link className="text-[11px]" href="#form">
              {t("contactStart")}{" "}
              <ArrowRight className="w-[13px] rtl:-scale-x-100" />
            </Link>
          </Button>
          <small className="m-2.5 block text-[9px] text-muted-foreground">
            {t("contactReplyTime")}
          </small>
        </div>
      </section>
      <section
        id="contact"
        className="py-[76px] max-[700px]:py-[54px] bg-muted"
      >
        <div className="app-container py-0">
          <SectionTitle title={t("contactTitle")} copy={t("contactCopy")} />
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
    </>
  );
}
