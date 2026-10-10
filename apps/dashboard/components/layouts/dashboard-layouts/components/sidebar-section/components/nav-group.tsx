"use client";

import { Link, usePathname } from "../../../../../../i18n/navigation";
import { useTranslations } from "next-intl";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@repo/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@repo/ui/sidebar";
import { useDirection } from "@repo/ui/direction";
import { ChevronLeft, ChevronRight } from "@repo/ui/icons";
import type { SidebarNavGroup } from "../utils/constants";
import { isActivePath } from "../utils/is-active-path";

export function NavGroup({ group }: { group: SidebarNavGroup }) {
  const t = useTranslations();
  // Locale-free ("/dashboard/skills"), so it compares directly with the nav hrefs.
  const pathname = usePathname();
  const isRtl = useDirection() === "rtl";
  // Points toward the inline end when closed, rotates down when open.
  const Chevron = isRtl ? ChevronLeft : ChevronRight;
  const { isMobile, setOpenMobile } = useSidebar();
  // Close the drawer after navigating on small screens.
  const handleNavigate = () => {
    if (isMobile) setOpenMobile(false);
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{t(group.labelKey)}</SidebarGroupLabel>
      <SidebarMenu>
        {group.items.map((item) => {
          const Icon = item.icon;

          if (!item.items?.length) {
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  tooltip={t(item.titleKey)}
                  isActive={isActivePath(pathname, item.href)}
                >
                  <Link href={item.href} onClick={handleNavigate}>
                    <Icon />
                    <span>{t(item.titleKey)}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          }

          const isSectionActive = isActivePath(pathname, item.href, false);

          return (
            <Collapsible
              key={item.href}
              asChild
              defaultOpen={isSectionActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={t(item.titleKey)}
                    isActive={isSectionActive}
                  >
                    <Icon />
                    <span>{t(item.titleKey)}</span>
                    <Chevron
                      className={`ms-auto transition-transform duration-200 ${isRtl ? "group-data-[state=open]/collapsible:-rotate-90" : "group-data-[state=open]/collapsible:rotate-90"}`}
                    />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.href}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={isActivePath(pathname, subItem.href)}
                        >
                          <Link href={subItem.href} onClick={handleNavigate}>
                            <span>{t(subItem.titleKey)}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
