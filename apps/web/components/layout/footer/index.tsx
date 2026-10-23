"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowUp, Mail } from "@repo/ui/icons";
import { BrandLink } from "../header/components";
import { navItems } from "../header/utils";
import { FooterColumn, SocialButtons } from "./components";
import { useFooterLinks } from "./hooks";
import { currentYear, linkClass, serviceLinks } from "./utils";

export function Footer() {
  const t = useTranslations();
  const links = useFooterLinks();
  const email = links.find((link) => link.kind === "email");
  return (
    <footer className="relative bg-surface">
      {/* Gradient rule along the top edge. */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/60 to-transparent"
      />
      <div className="app-container grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1.2fr] lg:gap-12">
        <div className="flex flex-col gap-5">
          <BrandLink className="self-start" />
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            {t("footerTagline")}
          </p>
          <SocialButtons links={links} />
        </div>

        <FooterColumn title={t("footerNavigate")}>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5 lg:grid-cols-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link className={linkClass} href={item.href}>
                  {t(item.labelKey)}
                </Link>
              </li>
            ))}
          </ul>
        </FooterColumn>

        <FooterColumn title={t("footerWhatIDo")}>
          <ul className="flex flex-col gap-2.5">
            {serviceLinks.map((item) => (
              <li key={item.labelKey}>
                <Link className={linkClass} href={item.href}>
                  {t(item.labelKey)}
                </Link>
              </li>
            ))}
          </ul>
        </FooterColumn>

        <FooterColumn title={t("footerSayHello")}>
          {email && (
            <a
              className="group flex items-center gap-3 rounded-2xl border border-border bg-background/60 p-3 no-underline transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
              href={email.href}
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Mail aria-hidden="true" className="size-5" />
              </span>
              <span
                className="min-w-0 truncate text-sm font-semibold text-foreground"
                dir="ltr"
              >
                {email.value}
              </span>
            </a>
          )}
          <Link
            className="inline-flex items-center gap-1.5 self-start rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground no-underline shadow-md shadow-primary/25 transition hover:-translate-y-0.5 hover:shadow-lg"
            href="#form"
          >
            {t("contactStart")}
          </Link>
        </FooterColumn>
      </div>

      <div className="border-t border-border">
        <div className="app-container flex flex-col items-center justify-between gap-3 py-5 text-xs text-muted-foreground sm:flex-row">
          <p>
            {t("footerCopyright", { year: currentYear() })}{" "}
            <span className="hidden sm:inline">{t("footerRights")}</span>
          </p>
          <Link
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-muted-foreground no-underline transition hover:border-primary/40 hover:text-primary"
            href="#home"
          >
            <ArrowUp aria-hidden="true" className="size-3.5" />
            {t("footerBackToTop")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
