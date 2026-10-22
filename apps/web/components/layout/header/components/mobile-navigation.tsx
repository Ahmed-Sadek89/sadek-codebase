"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@repo/ui/drawer";
import { Menu, X } from "@repo/ui/icons";
import { cn } from "@repo/ui/utils";
import { getDirection } from "../../../../i18n/config";
import { navItems } from "../utils";
import { LanguageSelect } from "./language-select";
import { ThemeToggle } from "./theme-toggle";

/**
 * Hamburger menu below `lg`. Its footer holds the language and theme
 * controls, which the header bar hides on phones.
 */
export function MobileNavigation({ active }: { active?: string }) {
  const t = useTranslations();
  // Slide in from the inline end: the right in LTR, the left in Arabic.
  const side = getDirection(useLocale()) === "rtl" ? "left" : "right";
  return (
    <Drawer direction={side}>
      <DrawerTrigger asChild>
        <button
          type="button"
          className="grid size-10 place-items-center rounded-full border border-border bg-card/60 text-foreground transition hover:bg-muted lg:hidden"
          aria-label={t("navOpen")}
        >
          <Menu className="size-5" aria-hidden="true" />
        </button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="relative pe-14">
          <DrawerTitle>{t("navTitle")}</DrawerTitle>
          <DrawerDescription>{t("navDescription")}</DrawerDescription>
          <DrawerClose asChild>
            <button
              type="button"
              className="absolute end-4 top-4 grid size-9 place-items-center rounded-full text-foreground hover:bg-muted"
              aria-label={t("navClose")}
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </DrawerClose>
        </DrawerHeader>
        <nav
          aria-label={t("navMobileLabel")}
          className="flex flex-col gap-1 overflow-y-auto px-4"
        >
          {navItems.map((item) => {
            const isActive = item.href === `#${active}`;
            return (
              <DrawerClose asChild key={item.href}>
                <Link
                  aria-current={isActive ? "location" : undefined}
                  className={cn(
                    "flex items-center justify-between rounded-lg px-3 py-3 text-sm no-underline transition-colors",
                    isActive
                      ? "bg-primary/10 font-semibold text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                  href={item.href}
                >
                  {t(item.labelKey)}
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="size-1.5 rounded-full bg-primary"
                    />
                  )}
                </Link>
              </DrawerClose>
            );
          })}
        </nav>
        <DrawerFooter className="mt-auto flex-row items-center justify-between border-t border-border sm:hidden">
          <LanguageSelect />
          <ThemeToggle />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
