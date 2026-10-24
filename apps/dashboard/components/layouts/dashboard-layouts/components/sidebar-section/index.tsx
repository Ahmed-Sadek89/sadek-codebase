"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarSeparator,
} from "@repo/ui/sidebar";
import { Link } from "../../../../../i18n/navigation";
import { AppLogo } from "../../../../ui/app-logo";
import { NavGroup } from "./components/nav-group";
import { SidebarUser } from "./components/sidebar-user";
import { SIDEBAR_NAV_GROUPS } from "./utils/constants";

const SidebarSection = () => {
  return (
    <Sidebar
      collapsible="icon"
      // Sit below the sticky h-16 header on large screens.
      className="top-16 h-[calc(100svh-4rem)]"
    >
      <SidebarHeader className="items-center">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 py-1 text-[17px] font-extrabold text-foreground no-underline"
        >
          <AppLogo size={32} className="group-data-[collapsible=icon]:max-w-8" />
          <span className="group-data-[collapsible=icon]:hidden">Sadek</span>
        </Link>
      </SidebarHeader>
      <SidebarSeparator className="mx-0" />
      <SidebarContent>
        {SIDEBAR_NAV_GROUPS.map((group) => (
          <NavGroup key={group.labelKey} group={group} />
        ))}
      </SidebarContent>
      <SidebarSeparator className="mx-0" />
      <SidebarFooter>
        <SidebarUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

export default SidebarSection;
