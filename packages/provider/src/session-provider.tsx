"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";

export function SessionProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextAuthSessionProvider
      basePath="/api/session" // the base path of the session provider
      refetchInterval={10 * 60} // make it less time that the expiration time of the access token
      refetchOnWindowFocus // refetch when the user comes back to the page tab
      refetchWhenOffline={false} // don't refetch when the user is offline
    >
      {children}
    </NextAuthSessionProvider>
  );
}
