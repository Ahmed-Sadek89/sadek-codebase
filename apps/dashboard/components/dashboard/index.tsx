"use client";

import { useSession, signOut } from "next-auth/react";
import { Button } from "@repo/ui/button";

export default function Dashboard() {
  const { data: session } = useSession();
  console.log({session})
  return (
    <main className="min-h-svh bg-background p-8 text-foreground">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <Button onClick={() => void signOut({ redirectTo: "/" })}>
        Sign out
      </Button>
    </main>
  );
}
