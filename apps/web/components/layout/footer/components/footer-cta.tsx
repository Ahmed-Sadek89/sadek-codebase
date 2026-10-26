import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowRight, Mail } from "@repo/ui/icons";
import type { ProfileLink } from "../../../homepage/utils";

/** The "Say hello" banner: a short pitch, the start-a-project button and the email. */
export function FooterCta({ email }: { email?: ProfileLink }) {
  const t = useTranslations();
  return (
    <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-linear-135 from-primary/10 via-card/70 to-accent-strong/10 p-6 shadow-lg shadow-primary/5 backdrop-blur-sm sm:p-8 lg:p-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -end-16 -top-16 size-56 rounded-full bg-primary/15 blur-3xl"
      />
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex max-w-xl flex-col gap-2">
          <span className="inline-flex items-center gap-2 self-start rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold tracking-wider text-primary uppercase ring-1 ring-primary/20">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-success" />
            </span>
            {t("footerSayHello")}
          </span>
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            {t("footerCtaTitle")}
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            {t("footerCtaText")}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:shrink-0">
          <Link
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground no-underline shadow-md shadow-primary/25 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/30"
            href="#form"
          >
            {t("contactStart")}
            <ArrowRight
              aria-hidden="true"
              className="size-4 transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
            />
          </Link>
          {email && (
            <a
              className="group inline-flex min-w-0 items-center gap-2.5 rounded-full border border-border bg-background/70 py-1.5 ps-1.5 pe-5 no-underline transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
              href={email.href}
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Mail aria-hidden="true" className="size-4" />
              </span>
              <span
                className="min-w-0 truncate text-sm font-semibold text-foreground"
                dir="ltr"
              >
                {email.value}
              </span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
