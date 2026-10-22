import { IMAGE_REMOTE_PATTERNS } from "./image-remote-patterns";

/**
 * True for URLs on a host allowed in next.config.ts `images`
 * (IMAGE_REMOTE_PATTERNS); next/image throws while rendering any other host,
 * so other URLs must be passed with `unoptimized`.
 */
export function isMediaUrl(url: string | null | undefined): url is string {
  if (!url) return false;
  try {
    const { protocol, hostname } = new URL(url);
    return IMAGE_REMOTE_PATTERNS.some(
      (pattern) =>
        `${pattern.protocol}:` === protocol && pattern.hostname === hostname,
    );
  } catch {
    return false;
  }
}
