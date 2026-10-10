"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
  SidebarSeparator,
} from "@repo/ui/sidebar";
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
