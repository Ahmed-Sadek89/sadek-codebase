"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
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
import { SIGNED_OUT_REDIRECT_PATH } from "../../../../../../utils/constants";
import { ConfirmAction } from "../../../../../ui/confirm-action";
import { PROFILE_PATH } from "../utils/constants";

export function UserMenu() {
  const { data: session } = useSession();
  const email = session?.user?.email ?? "";
  const name = session?.user?.name ?? email;
  const initial = (name.charAt(0) || "U").toUpperCase();
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label="Open user menu"
          className="rounded-full outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          <Avatar className="size-9">
            {session?.user?.image && (
              <AvatarImage src={session.user.image} alt="" />
            )}
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
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="danger"
            // The menu closes on select; the dialog lives outside it so it stays mounted.
            onSelect={() => setIsLogoutOpen(true)}
          >
            <LogOut />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmAction
        question="You will be signed out of your dashboard."
        onConfirm={() => signOut({ redirectTo: SIGNED_OUT_REDIRECT_PATH })}
        open={isLogoutOpen}
        onOpenChange={setIsLogoutOpen}
      />
    </>
  );
}
