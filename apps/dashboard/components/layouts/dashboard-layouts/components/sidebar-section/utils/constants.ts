import {
  FileText,
  FolderKanban,
  IdCard,
  LayoutDashboard,
  MessageSquare,
  Search,
  Sparkles,
  UserRound,
  type LucideIcon,
} from "@repo/ui/icons";
import type { MessageKey } from "../../../../../../i18n/types";

export type SidebarLink = {
  titleKey: MessageKey;
  href: string;
  /** Other routes that also highlight this link (with their nested routes), e.g. a detail page outside `href`. */
  activePrefixes?: string[];
};

export type SidebarNavItem = SidebarLink & {
  icon: LucideIcon;
  /** Nested links render in a collapsible submenu. */
  items?: SidebarLink[];
};

export type SidebarNavGroup = {
  labelKey: MessageKey;
  items: SidebarNavItem[];
};

/**
 * Sidebar order: daily use first (dashboard, messages inbox), then the
 * portfolio content in the order it appears on the site (about, services,
 * experience, skills, projects), then the website's SEO, then the account.
 */
export const SIDEBAR_NAV_GROUPS: SidebarNavGroup[] = [
  {
    labelKey: "navOverview",
    items: [
      { titleKey: "navDashboard", href: "/dashboard", icon: LayoutDashboard },
      {
        titleKey: "navContacts",
        href: "/dashboard/contacts",
        icon: MessageSquare,
      },
    ],
  },
  {
    labelKey: "navPortfolio",
    items: [
      {
        titleKey: "navUser",
        href: "/dashboard/user",
        icon: IdCard,
        items: [
          { titleKey: "navUserInfo", href: "/dashboard/user/info" },
          { titleKey: "navWhatCanIDo", href: "/dashboard/user/what-can-i-do" },
          { titleKey: "navUserCompanies", href: "/dashboard/user/companies" },
        ],
      },
      {
        titleKey: "navSkills",
        href: "/dashboard/skills",
        icon: Sparkles,
        items: [
          { titleKey: "navAllSkills", href: "/dashboard/skills" },
          { titleKey: "navCategories", href: "/dashboard/skills/category" },
        ],
      },
      {
        titleKey: "navProjects",
        href: "/dashboard/projects",
        icon: FolderKanban,
        items: [
          {
            titleKey: "navAllProjects",
            href: "/dashboard/projects",
            // The create/edit page /dashboard/projects/form/[slug] belongs to the list.
            activePrefixes: ["/dashboard/projects/form"],
          },
          { titleKey: "navCategories", href: "/dashboard/projects/category" },
        ],
      },
    ],
  },
  {
    labelKey: "navSeo",
    items: [
      // The website's pages first: each SEO row belongs to one of them.
      { titleKey: "navPages", href: "/dashboard/pages", icon: FileText },
      { titleKey: "navSeoPages", href: "/dashboard/seo", icon: Search },
    ],
  },
  {
    labelKey: "navAccount",
    items: [
      { titleKey: "navProfile", href: "/dashboard/profile", icon: UserRound },
    ],
  },
];
