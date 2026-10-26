import { useTranslations } from "next-intl";
import { Clock } from "@repo/ui/icons";
import type { ProfileLink } from "../../../utils";
import { ContactDetails } from "./contact-details";

/**
 * The info half of the contact card, on the primary gradient: heading, the
 * reply time up front (so visitors know what to expect), then the owner's links.
 */
export function ContactInfoPanel({ details }: { details: ProfileLink[] }) {
  const t = useTranslations();
  return (
    <aside className="relative isolate flex min-w-0 flex-col overflow-hidden bg-linear-135/srgb from-primary to-accent-strong p-5 text-white min-[375px]:p-6 sm:p-8 lg:p-10">
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
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/85">
        {t("contactBody")}
      </p>
      <p className="mt-4 inline-flex w-fit max-w-full items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
        <span className="relative flex size-2 shrink-0" aria-hidden="true">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-white opacity-75 motion-reduce:animate-none" />
          <span className="relative inline-flex size-2 rounded-full bg-white" />
        </span>
        <Clock aria-hidden="true" className="size-3.5 shrink-0" />
        <span className="min-w-0">{t("contactReplyTime")}</span>
      </p>
      {details.length > 0 && (
        <div className="mt-12  lg:pt-12">
          <h4 className="mb-3 text-[11px] font-semibold tracking-wide text-white/70 uppercase">
            {t("contactOtherWays")}
          </h4>
          <ContactDetails details={details} tone="inverse" />
        </div>
      )}
    </aside>
  );
}
