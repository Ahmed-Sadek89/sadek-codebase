/** Exact match for leaf links; parents also match their nested routes. */
export function isActivePath(pathname: string, href: string, exact = true) {
  if (pathname === href) return true;
  return !exact && pathname.startsWith(`${href}/`);
}

/** isActivePath for a sidebar link, also true on any of its `activePrefixes` routes. */
export function isActiveLink(
  pathname: string,
  link: { href: string; activePrefixes?: string[] },
  exact = true,
) {
  return (
    isActivePath(pathname, link.href, exact) ||
    (link.activePrefixes ?? []).some((prefix) => isActivePath(pathname, prefix, false))
  );
}
