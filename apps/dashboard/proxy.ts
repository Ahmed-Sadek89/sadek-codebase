import {
  NextResponse,
  type NextFetchEvent,
} from "next/server";
import { auth } from "./libs/auth";
import {
  DEFAULT_LOCALE,
  isLocale,
  LOCALE_COOKIE_NAME,
} from "./i18n/config";

const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;

// The typed event parameter selects auth()'s middleware overload.
export const proxy = auth((request, _event: NextFetchEvent) => {
  const { pathname, search } = request.nextUrl;
  const [, firstSegment] = pathname.split("/");

  // Unprefixed URL: send it to the user's last chosen language, else English.
  // The browser's Accept-Language is deliberately ignored.
  if (!isLocale(firstSegment)) {
    const savedLocale = request.cookies.get(LOCALE_COOKIE_NAME)?.value;
    const locale = isLocale(savedLocale) ? savedLocale : DEFAULT_LOCALE;
    const path = pathname === "/" ? "" : pathname;
    return NextResponse.redirect(
      new URL(`/${locale}${path}${search}`, request.url),
    );
  }

  const locale = firstSegment;
  const localizedPath = pathname.slice(locale.length + 1) || "/";
  const hasAccessToken = Boolean(request.auth?.accessToken);
  const isDashboardRoute =
    localizedPath === "/dashboard" || localizedPath.startsWith("/dashboard/");

  let response: NextResponse;
  if (isDashboardRoute && !hasAccessToken)
    response = NextResponse.redirect(new URL(`/${locale}`, request.url));
  else if (localizedPath === "/" && hasAccessToken)
    response = NextResponse.redirect(
      new URL(`/${locale}/dashboard`, request.url),
    );
  else response = NextResponse.next();

  // Remember the language so unprefixed links ("/", sign-out) land in it.
  if (request.cookies.get(LOCALE_COOKIE_NAME)?.value !== locale)
    response.cookies.set(LOCALE_COOKIE_NAME, locale, {
      path: "/",
      maxAge: ONE_YEAR_IN_SECONDS,
      sameSite: "lax",
    });

  return response;
});

export const config = {
  // Every page except API routes, Next.js internals, and files with an extension.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
