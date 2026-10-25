import { z } from "zod";
import { URL_PROTOCOLS } from "@repo/constants/url";

const httpUrl = z.url({
  protocol: new RegExp(`^(?:${URL_PROTOCOLS.join("|")})$`),
});

/**
 * The URLs the backend's `@IsUrl(URL_OPTIONS)` accepts
 * (sadek-backend/src/common/validation/url-options.ts): http(s) only, and a
 * host that is a domain with a TLD or an IPv4 address. Plain `z.url()` also
 * allows `ftp:`, `mailto:`, `localhost` and `https://example`.
 */
export function isHttpUrl(value: string) {
  if (!httpUrl.safeParse(value).success) return false;
  const { hostname } = new URL(value);
  return z.regexes.domain.test(hostname) || z.regexes.ipv4.test(hostname);
}
