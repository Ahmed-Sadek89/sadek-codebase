import { useTranslations } from "next-intl";
import type { ProfileLink } from "../../../utils";
import { ContactDetails } from "./contact-details";

/** Contact info card: heading, the owner's links and the reply time. */
export function ContactInfoPanel({ details }: { details: ProfileLink[] }) {
  const t = useTranslations();
  return (
    <aside className="relative isolate min-w-0 overflow-hidden rounded-3xl border border-border bg-linear-135/srgb from-primary to-accent-strong p-4 text-white shadow-2xl shadow-primary/10 min-[375px]:p-5 sm:rounded-[2rem] sm:p-10">
      {/* Decorative circles. */}
      <span
        aria-hidden="true"
        className="absolute -end-16 -top-16 -z-10 size-44 rounded-full bg-white/10 sm:-end-20 sm:-top-20 sm:size-64"
      />
      <span
        aria-hidden="true"
        className="absolute -start-12 -bottom-20 -z-10 size-40 rounded-full bg-white/10 sm:-start-16 sm:-bottom-24 sm:size-56"
      />
      <h3 className="text-xl font-bold sm:text-2xl">{t("contactInfoTitle")}</h3>
      <p className="mt-2 mb-6 max-w-sm text-sm leading-relaxed text-white/80 sm:mb-8">
        {t("contactBody")}
      </p>
      <ContactDetails details={details} />
      <p className="mt-5 inline-flex max-w-full items-center gap-2 rounded-2xl bg-white/15 px-3 py-2 text-xs leading-relaxed font-medium text-white backdrop-blur sm:mt-8 sm:rounded-full sm:py-1.5">
        <span className="relative flex size-2 shrink-0" aria-hidden="true">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-white opacity-75 motion-reduce:animate-none" />
          <span className="relative inline-flex size-2 rounded-full bg-white" />
        </span>
        <span className="min-w-0 wrap-break-word">{t("contactReplyTime")}</span>
      </p>
    </aside>
  );
}
