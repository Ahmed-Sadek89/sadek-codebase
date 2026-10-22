/** One remote host next/image may load (the shape of `images.remotePatterns`). */
export type ImageRemotePattern = {
  protocol: "https";
  hostname: string;
  pathname: string;
};

/**
 * Remote hosts next/image may load. Used by next.config.ts `images` and by
 * `isMediaUrl` in libs/media.ts (next/image throws while rendering any other host).
 */
export const IMAGE_REMOTE_PATTERNS: ImageRemotePattern[] = [
  {
    protocol: "https",
    hostname: "d3joi5y8c47cow.cloudfront.net",
    pathname: "/**",
  },
  {
    protocol: "https",
    hostname: "picsum.photos",
    pathname: "/**",
  },
  {
    protocol: "https",
    hostname: "loremflickr.com",
    pathname: "/**",
  },
];
