"use client";

import { useMemo } from "react";
import { jwtDecode } from "jwt-decode";
import { useSession } from "next-auth/react";
import type { AccessTokenPayload } from "@repo/types/auth";

type TokenUser = Pick<AccessTokenPayload, "email" | "avatar">;

/** Email and avatar from the access token's payload; empty when it is missing or malformed. */
function decodeTokenUser(accessToken: string | undefined): Partial<TokenUser> {
  if (!accessToken) return {};
  try {
    const { email, avatar } = jwtDecode<TokenUser>(accessToken);
    return { email, avatar };
  } catch {
    return {};
  }
}

/** Display fields for the signed-in user, shared by the header and sidebar. */
export function useCurrentUser() {
  const { data: session } = useSession();
  const accessToken = session?.accessToken;
  // Decoding only reads the payload; the backend still verifies the signature.
  const { email = "", avatar } = useMemo(
    () => decodeTokenUser(accessToken),
    [accessToken],
  );
  const name = email;
  const image = avatar ?? undefined;
  const initial = (name.charAt(0) || "U").toUpperCase();

  return { email, name, image, initial };
}
