import {
  FolderKanban,
  LayoutDashboard,
  Sparkles,
  UserRound,
  type LucideIcon,
} from "@repo/ui/icons";

export type SidebarLink = {
  title: string;
  href: string;
};

export type SidebarNavItem = SidebarLink & {
  icon: LucideIcon;
  /** Nested links render in a collapsible submenu. */
  items?: SidebarLink[];
};

export type SidebarNavGroup = {
  label: string;
  items: SidebarNavItem[];
};

export const SIDEBAR_NAV_GROUPS: SidebarNavGroup[] = [
  {
    label: "Overview",
    items: [{ title: "Dashboard", href: "/dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Portfolio",
    items: [
      {
        title: "Skills",
        href: "/dashboard/skills",
        icon: Sparkles,
        items: [
          { title: "All skills", href: "/dashboard/skills" },
          { title: "Categories", href: "/dashboard/skills/category" },
        ],
      },
      {
        title: "Projects",
        href: "/dashboard/projects",
        icon: FolderKanban,
        items: [
          { title: "All projects", href: "/dashboard/projects" },
          { title: "Categories", href: "/dashboard/projects/category" },
        ],
      }

    ],
  },
  {
    label: "Account",
    items: [
      { title: "Profile", href: "/dashboard/profile", icon: UserRound },
    ],
  },
];
