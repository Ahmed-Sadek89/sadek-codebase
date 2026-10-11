import process from "node:process";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { IMAGE_REMOTE_PATTERNS } from "./libs/image-remote-patterns";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: IMAGE_REMOTE_PATTERNS,
  },
  async rewrites() {
    const backendUrl = (
      process.env.BACKEND_URL ?? "http://localhost:4000"
    ).replace(/\/$/, "");
    return [
      { source: "/api/auth/:path*", destination: `${backendUrl}/auth/:path*` },
    ];
  },
};

export default withNextIntl(nextConfig);
