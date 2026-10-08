"use client";

import { Button } from "@repo/ui/button";
import { Menu, PanelLeft } from "@repo/ui/icons";

const iconButtonClassName = "size-9 p-0";

// Sidebar state is not implemented yet; wire these handlers once it exists.
export function SidebarToggles({
  onToggleSidebar,
  onOpenMobileSidebar,
}: {
  onToggleSidebar?: () => void;
  onOpenMobileSidebar?: () => void;
}) {
  return (
    <>
      <Button
        type="button"
        variant="ghost"
        onClick={onToggleSidebar}
        aria-label="Toggle sidebar"
        className={`hidden lg:inline-flex ${iconButtonClassName}`}
      >
        <PanelLeft className="size-5" aria-hidden />
      </Button>
      <Button
        type="button"
        variant="ghost"
        onClick={onOpenMobileSidebar}
        aria-label="Open sidebar"
        className={`lg:hidden ${iconButtonClassName}`}
      >
        <Menu className="size-5" aria-hidden />
      </Button>
    </>
  );
}
