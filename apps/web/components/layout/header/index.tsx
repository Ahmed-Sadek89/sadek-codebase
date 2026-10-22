import Link from "next/link";
import { useTranslations } from "next-intl";
import { LanguageSelect, MobileNavigation, ThemeToggle } from "./components";
import { navItems } from "./utils";

export function Header() {
  const t = useTranslations();
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
      <div className="app-container relative flex h-17.5 items-center justify-between gap-6">
        <Link
          className="flex items-center gap-2 text-[17px] font-extrabold text-foreground no-underline"
          href="#home"
        >
          <span className="grid size-6 place-items-center rounded-md bg-primary font-black text-primary-foreground">
            W
          </span>
          {t("brandName")}
        </Link>
        <MobileNavigation />
        <nav aria-label={t("navMainLabel")} className="hidden gap-6 md:flex">
          {navItems.map((item) => (
            <Link
              className="text-muted-foreground no-underline hover:text-primary"
              key={item.href}
              href={item.href}
            >
              {t(item.labelKey)}
            </Link>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <LanguageSelect />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
