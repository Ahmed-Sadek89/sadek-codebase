"use client";

import { signOut } from "next-auth/react";
import { Button } from "@repo/ui/button";
import { useRequiredSession } from "../../hooks/use-required-session";
import { SIGNED_OUT_REDIRECT_PATH } from "../../utils/constants";

export default function Dashboard() {
  useRequiredSession();
  return (
    <main className="min-h-svh bg-background p-8 text-foreground">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <Button
        onClick={() => void signOut({ redirectTo: SIGNED_OUT_REDIRECT_PATH })}
      >
        Sign out
      </Button>
    </main>
  );
}
