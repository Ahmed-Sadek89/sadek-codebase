"use client";

import { useState } from "react";
import { Link } from "../../../../../../i18n/navigation";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import { LogOut, User } from "@repo/ui/icons";
import { useCurrentUser } from "../../../../../../hooks/use-current-user";
import { SIGNED_OUT_REDIRECT_PATH } from "../../../../../../utils/constants";
import { ConfirmAction } from "../../../../../ui/confirm-action";
import { PROFILE_PATH } from "../utils/constants";

export function UserMenu() {
  const t = useTranslations();
  const { email, image, initial } = useCurrentUser();
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label={t("userMenuOpen")}
          className="rounded-full outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          <Avatar className="size-9">
            {image && <AvatarImage src={image} alt="" />}
            <AvatarFallback className="bg-primary font-semibold text-primary-foreground">
              {initial}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {email && (
            <>
              <DropdownMenuLabel className="truncate font-normal text-muted-foreground">
                {email}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuItem asChild>
            <Link href={PROFILE_PATH}>
              <User />
              {t("profile")}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="danger"
            // The menu closes on select; the dialog lives outside it so it stays mounted.
            onSelect={() => setIsLogoutOpen(true)}
          >
            <LogOut />
            {t("logout")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmAction
        question={t("logoutQuestion")}
        onConfirm={() => signOut({ redirectTo: SIGNED_OUT_REDIRECT_PATH })}
        open={isLogoutOpen}
        onOpenChange={setIsLogoutOpen}
      />
    </>
  );
}
