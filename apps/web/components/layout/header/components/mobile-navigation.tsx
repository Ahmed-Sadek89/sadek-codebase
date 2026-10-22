"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@repo/ui/drawer";
import { Menu, X } from "@repo/ui/icons";
import { getDirection } from "../../../../i18n/config";
import { navItems } from "../utils";

export function MobileNavigation() {
  const t = useTranslations();
  // Slide in from the inline end: the right in LTR, the left in Arabic.
  const side = getDirection(useLocale()) === "rtl" ? "left" : "right";
  return (
    <Drawer direction={side}>
      <DrawerTrigger asChild>
        <button
          type="button"
          className="border-0 bg-transparent p-2 text-foreground md:hidden"
          aria-label={t("navOpen")}
        >
          <Menu aria-hidden="true" />
        </button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="relative pe-14">
          <DrawerTitle>{t("navTitle")}</DrawerTitle>
          <DrawerDescription>{t("navDescription")}</DrawerDescription>
          <DrawerClose asChild>
            <button
              type="button"
              className="absolute end-4 top-4 p-2 text-foreground"
              aria-label={t("navClose")}
            >
              <X aria-hidden="true" />
            </button>
          </DrawerClose>
        </DrawerHeader>
        <nav
          aria-label={t("navMobileLabel")}
          className="flex flex-col gap-2 overflow-y-auto p-4"
        >
          {navItems.map((item) => (
            <DrawerClose asChild key={item.href}>
              <Link
                className="rounded-md px-3 py-3 text-sm text-muted-foreground no-underline hover:bg-muted hover:text-primary"
                href={item.href}
              >
                {t(item.labelKey)}
              </Link>
            </DrawerClose>
          ))}
        </nav>
      </DrawerContent>
    </Drawer>
  );
}
