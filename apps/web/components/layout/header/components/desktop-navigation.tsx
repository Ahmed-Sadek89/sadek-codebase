"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { cn } from "@repo/ui/utils";
import { navItems } from "../utils";

/** The section links in a pill bar, the current section highlighted. Large screens only. */
export function DesktopNavigation({ active }: { active?: string }) {
  const t = useTranslations();
  return (
    <nav
      aria-label={t("navMainLabel")}
      className="hidden items-center gap-1 rounded-full border border-border bg-card/60 p-1 shadow-sm backdrop-blur lg:flex"
    >
      {navItems.map((item) => {
        const isActive = item.href === `#${active}`;
        return (
          <Link
            aria-current={isActive ? "location" : undefined}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-[13px] font-medium whitespace-nowrap no-underline transition-colors",
              isActive
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
            key={item.href}
            href={item.href}
          >
            {t(item.labelKey)}
          </Link>
        );
      })}
    </nav>
  );
}
