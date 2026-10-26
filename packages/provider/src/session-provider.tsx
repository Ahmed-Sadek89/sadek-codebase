"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";

export function SessionProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextAuthSessionProvider
      basePath="/api/session" // the base path of the session provider
      refetchInterval={60} // seconds; the jwt callback refreshes the access token in its last 30 s, so a check must land before it expires
      refetchOnWindowFocus // refetch when the user comes back to the page tab
      refetchWhenOffline={false} // don't refetch when the user is offline
    >
      {children}
    </NextAuthSessionProvider>
  );
}
