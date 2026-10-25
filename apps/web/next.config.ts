import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { IMAGE_REMOTE_PATTERNS } from "./libs/image-remote-patterns";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: IMAGE_REMOTE_PATTERNS,
  },
  // The PWA service worker (public/sw.js): browsers must re-check it on every
  // load, or an old worker could keep serving old caches.
  async headers() {
    return [
      {
        source: "/sw.js",
        headers: [
          { key: "Content-Type", value: "application/javascript; charset=utf-8" },
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Service-Worker-Allowed", value: "/" },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
