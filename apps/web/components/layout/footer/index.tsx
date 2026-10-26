"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowUp } from "@repo/ui/icons";
import { BrandLink } from "../header/components";
import { navItems } from "../header/utils";
import {
  FooterColumn,
  FooterCta,
  FooterLink,
  SocialButtons,
} from "./components";
import { useFooterLinks } from "./hooks";
import { currentYear, serviceLinks } from "./utils";

export function Footer() {
  const t = useTranslations();
  const links = useFooterLinks();
  const email = links.find((link) => link.kind === "email");
  return (
    <footer className="relative isolate overflow-hidden bg-surface">
      {/* Gradient rule along the top edge. */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/60 to-transparent"
      />
      {/* Soft glows and a faint dot grid behind the content. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 start-1/2 size-[28rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl rtl:translate-x-1/2" />
        <div className="absolute -end-24 bottom-0 size-80 rounded-full bg-accent-strong/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(var(--border)_1px,transparent_1px)] mask-[linear-gradient(to_bottom,black,transparent_70%)] bg-size-[22px_22px] opacity-60" />
      </div>

      <div className="app-container pt-14 pb-0 sm:pt-16">
        <FooterCta email={email} />
      </div>

      <div className="app-container grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.6fr_1.2fr_1fr] lg:gap-14">
        <div className="flex flex-col gap-5 sm:col-span-2 lg:col-span-1">
          <BrandLink className="self-start" />
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            {t("footerTagline")}
          </p>
          <SocialButtons links={links} />
        </div>

        <FooterColumn title={t("footerNavigate")}>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-3">
            {navItems.map((item) => (
              <li key={item.href}>
                <FooterLink href={item.href}>{t(item.labelKey)}</FooterLink>
              </li>
            ))}
          </ul>
        </FooterColumn>

        <FooterColumn title={t("footerWhatIDo")}>
          <ul className="flex flex-col gap-3">
            {serviceLinks.map((item) => (
              <li key={item.labelKey}>
                <FooterLink href={item.href}>{t(item.labelKey)}</FooterLink>
              </li>
            ))}
          </ul>
        </FooterColumn>
      </div>

      <div className="relative border-t border-border bg-surface/80 backdrop-blur-sm">
        <div className="app-container flex flex-col items-center justify-between gap-3 py-5 text-xs text-muted-foreground sm:flex-row">
          <p className="text-center sm:text-start">
            {t("footerCopyright", { year: currentYear() })}{" "}
            <span className="hidden sm:inline">{t("footerRights")}</span>
          </p>
          <Link
            className="group inline-flex items-center gap-2 rounded-full border border-border bg-background/70 py-1.5 ps-3.5 pe-1.5 text-muted-foreground no-underline shadow-sm transition hover:border-primary/40 hover:text-primary"
            href="#home"
          >
            {t("footerBackToTop")}
            <span className="grid size-6 place-items-center rounded-full bg-primary/10 text-primary transition group-hover:-translate-y-0.5 group-hover:bg-primary group-hover:text-primary-foreground">
              <ArrowUp aria-hidden="true" className="size-3.5" />
            </span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
