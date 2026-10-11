import {
  FolderKanban,
  LayoutDashboard,
  Sparkles,
  UserRound,
  type LucideIcon,
} from "@repo/ui/icons";
import type { MessageKey } from "../../../../../../i18n/types";

export type SidebarLink = {
  titleKey: MessageKey;
  href: string;
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

export const SIDEBAR_NAV_GROUPS: SidebarNavGroup[] = [
  {
    labelKey: "navOverview",
    items: [{ titleKey: "navDashboard", href: "/dashboard", icon: LayoutDashboard }],
  },
  {
    labelKey: "navPortfolio",
    items: [
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
          { titleKey: "navAllProjects", href: "/dashboard/projects" },
          { titleKey: "navCategories", href: "/dashboard/projects/category" },
        ],
      }

    ],
  },
  {
    labelKey: "navAccount",
    items: [
      { titleKey: "navProfile", href: "/dashboard/profile", icon: UserRound },
    ],
  },
 
];
