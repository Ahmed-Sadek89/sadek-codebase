/** Exact match for leaf links; parents also match their nested routes. */
export function isActivePath(pathname: string, href: string, exact = true) {
  if (pathname === href) return true;
  return !exact && pathname.startsWith(`${href}/`);
}
