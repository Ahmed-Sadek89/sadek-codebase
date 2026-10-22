"use client";

import { cn } from "@repo/ui/utils";
import {
  BrandLink,
  DesktopNavigation,
  LanguageSelect,
  MobileNavigation,
  ThemeToggle,
} from "./components";
import { useActiveSection, useScrolled } from "./hooks";
import { sectionIds } from "./utils";

export function Header() {
  const scrolled = useScrolled();
  const active = useActiveSection(sectionIds);
  return (
    <header
      className={cn(
        "sticky top-0 z-30 border-b transition-[background-color,box-shadow,border-color] duration-300",
        scrolled
          ? "border-border bg-background/85 shadow-sm backdrop-blur-md"
          : "border-transparent bg-background/40 backdrop-blur-sm",
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center justify-between gap-4 px-4 sm:h-[70px] sm:px-6">
        <BrandLink />
        <DesktopNavigation active={active} />
        <div className="flex shrink-0 items-center gap-2">
          {/* On phones these move into the menu drawer. */}
          <div className="hidden items-center gap-2 sm:flex">
            <LanguageSelect />
            <ThemeToggle />
          </div>
          <MobileNavigation active={active} />
        </div>
      </div>
    </header>
  );
}
