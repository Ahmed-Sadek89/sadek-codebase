import { Link } from "../../../../../i18n/navigation";
import { ThemeSelect } from "../../../../ui/theme-switcher";
import { LanguageSelect } from "../../../../ui/language-switcher";
import { SidebarToggles } from "./components/sidebar-toggles";
import { UserMenu } from "./components/user-menu";

const HeaderSection = () => {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <SidebarToggles />
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-[17px] font-extrabold text-foreground no-underline"
          >
            <span className="grid size-7 place-items-center rounded-md bg-primary font-black text-primary-foreground">
              S
            </span>
            <span className="hidden sm:inline">Sadek</span>
          </Link>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <ThemeSelect />
          <LanguageSelect />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}

export default HeaderSection;
