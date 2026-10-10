"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/avatar";
import { Button } from "@repo/ui/button";
import { LogOut } from "@repo/ui/icons";
import {
  SidebarMenu,
  SidebarMenuItem,
} from "@repo/ui/sidebar";
import { ConfirmAction } from "../../../../../ui/confirm-action";
import { useCurrentUser } from "../../../../../../hooks/use-current-user";
import { SIGNED_OUT_REDIRECT_PATH } from "../../../../../../utils/constants";

export function SidebarUser() {
  const t = useTranslations();
  const { email, name, image, initial } = useCurrentUser();
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  return (
    <SidebarMenu>
      <SidebarMenuItem className="flex items-center gap-2 rounded-md p-1 group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:p-0">
        <Avatar className="size-8 shrink-0">
          {image && <AvatarImage src={image} alt="" />}
          <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">
            {initial}
          </AvatarFallback>
        </Avatar>
        <div className="grid min-w-0 flex-1 text-start text-sm leading-tight group-data-[collapsible=icon]:hidden">
          <span className="truncate font-medium">{name || t("sidebarUserFallback")}</span>
          {email && name !== email && (
            <span className="truncate text-xs text-muted-foreground">
              {email}
            </span>
          )}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setIsLogoutOpen(true)}
          aria-label={t("logout")}
          title={t("logout")}
          className="size-8 shrink-0 p-0 text-muted-foreground hover:text-danger"
        >
          <LogOut className="size-4" aria-hidden />
        </Button>
        <ConfirmAction
          question={t("logoutQuestion")}
          onConfirm={() => signOut({ redirectTo: SIGNED_OUT_REDIRECT_PATH })}
          open={isLogoutOpen}
          onOpenChange={setIsLogoutOpen}
        />
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
