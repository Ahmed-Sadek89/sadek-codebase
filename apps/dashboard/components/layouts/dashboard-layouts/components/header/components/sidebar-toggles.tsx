"use client";

import { Button } from "@repo/ui/button";
import { Menu, PanelLeft } from "@repo/ui/icons";
import { useSidebar } from "@repo/ui/sidebar";

const iconButtonClassName = "size-9 p-0";

export function SidebarToggles() {
  const { open, openMobile, setOpen, setOpenMobile } = useSidebar();

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        onClick={() => setOpen(!open)}
        aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
        aria-expanded={open}
        className={`hidden lg:inline-flex ${iconButtonClassName}`}
      >
        <PanelLeft className="size-5" aria-hidden />
      </Button>
      <Button
        type="button"
        variant="ghost"
        onClick={() => setOpenMobile(true)}
        aria-label="Open sidebar"
        aria-expanded={openMobile}
        className={`lg:hidden ${iconButtonClassName}`}
      >
        <Menu className="size-5" aria-hidden />
      </Button>
    </>
  );
}
