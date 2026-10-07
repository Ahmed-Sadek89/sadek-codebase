"use client";

import { useSession } from "next-auth/react";
import { SIGNED_OUT_REDIRECT_PATH } from "../utils/constants";

/**
 * Leaves the dashboard as soon as the session ends, e.g. after a failed token
 * refresh. A full navigation lets the proxy see the cleared session cookie.
 */
export function useRequiredSession() {
  return useSession({
    required: true,
    onUnauthenticated: () => window.location.replace(SIGNED_OUT_REDIRECT_PATH),
  });
}
