import {
  NextResponse,
  type NextFetchEvent,
} from "next/server";
import { auth } from "./libs/auth";

// The typed event parameter selects auth()'s middleware overload.
export const proxy = auth((request, _event: NextFetchEvent) => {
  const pathname = request.nextUrl.pathname;
  const hasAccessToken = Boolean(request.auth?.accessToken);
  const isDashboardRoute =
    pathname === "/dashboard" || pathname.startsWith("/dashboard/");

  if (isDashboardRoute && !hasAccessToken)
    return NextResponse.redirect(new URL("/", request.url));
  if (pathname === "/" && hasAccessToken)
    return NextResponse.redirect(new URL("/dashboard", request.url));
  return NextResponse.next();
});

export const config = {
  matcher: ["/", "/dashboard/:path*"],
};
