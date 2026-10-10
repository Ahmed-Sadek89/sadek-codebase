import { Link } from "../../../../i18n/navigation";
import { ThemeSelect } from "../../../ui/theme-switcher";
import { LanguageSelect } from "../../../ui/language-switcher";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
      <div className="app-container flex h-17.5 items-center justify-between gap-4 py-0">
        <Link
          href="/"
          className="flex items-center gap-2 text-[17px] font-extrabold text-foreground no-underline"
        >
          <span className="grid size-7 place-items-center rounded-md bg-primary font-black text-primary-foreground">
            S
          </span>
          Sadek
        </Link>
        <div className="flex items-center gap-2">
          <ThemeSelect />
          <LanguageSelect />
        </div>
      </div>
    </header>
  );
}
