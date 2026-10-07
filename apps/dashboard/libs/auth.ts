import type { NextAuthResult } from "next-auth";
import { createAuth } from "@repo/libs/auth";
import { authService } from "@repo/services/auth";

// Server-side auth calls prefer the private URL; the public one remains a fallback.
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL!;
if (!backendUrl) throw new Error("BACKEND_URL is not configured");

const authentication: NextAuthResult = createAuth(
  backendUrl,
  authService,
  "sadek-dashboard",
);

export const handlers: NextAuthResult["handlers"] = authentication.handlers;

export const auth: NextAuthResult["auth"] = authentication.auth;
