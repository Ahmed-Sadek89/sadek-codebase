import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Adds the locale prefix: "/" -> "/ar" on an Arabic device (see i18n/routing.ts).
export const proxy = createMiddleware(routing);

export const config = {
  // Every page except API routes, Next.js internals, and files with an extension.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
