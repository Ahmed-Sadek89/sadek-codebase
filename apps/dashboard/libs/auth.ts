import type { NextAuthResult } from "next-auth";
import { createAuth } from "@repo/libs/auth";
import { authService } from "@repo/services/auth";

const authentication: NextAuthResult = createAuth(
  process.env.NEXT_PUBLIC_BACKEND_URL!,
  authService,
  "sadek-dashboard",
);

export const handlers: NextAuthResult["handlers"] = authentication.handlers;
