import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { IMAGE_REMOTE_PATTERNS } from "./libs/image-remote-patterns";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: IMAGE_REMOTE_PATTERNS,
  },
};

export default withNextIntl(nextConfig);
