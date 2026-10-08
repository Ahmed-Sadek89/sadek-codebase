"use client";

import { useSession } from "next-auth/react";

/** Display fields for the signed-in user, shared by the header and sidebar. */
export function useCurrentUser() {
  const { data: session } = useSession();
  const email = session?.user?.email ?? "";
  const name = session?.user?.name ?? email;
  const image = session?.user?.image ?? undefined;
  const initial = (name.charAt(0) || "U").toUpperCase();

  return { email, name, image, initial };
}
