"use client";

import Link from "next/link";
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
import { navItems } from "../utils";

export function MobileNavigation() {
  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <button
          type="button"
          className="border-0 bg-transparent p-2 text-foreground md:hidden"
          aria-label="Open navigation"
        >
          <Menu aria-hidden="true" />
        </button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="relative pr-14">
          <DrawerTitle>Navigation</DrawerTitle>
          <DrawerDescription>Explore Workfolio.</DrawerDescription>
          <DrawerClose asChild>
            <button
              type="button"
              className="absolute right-4 top-4 p-2 text-foreground"
              aria-label="Close navigation"
            >
              <X aria-hidden="true" />
            </button>
          </DrawerClose>
        </DrawerHeader>
        <nav
          aria-label="Mobile navigation"
          className="flex flex-col gap-2 overflow-y-auto p-4"
        >
          {navItems.map((item) => (
            <DrawerClose asChild key={item.href}>
              <Link
                className="rounded-md px-3 py-3 text-sm text-muted-foreground no-underline hover:bg-muted hover:text-primary"
                href={item.href}
              >
                {item.label}
              </Link>
            </DrawerClose>
          ))}
        </nav>
      </DrawerContent>
    </Drawer>
  );
}
