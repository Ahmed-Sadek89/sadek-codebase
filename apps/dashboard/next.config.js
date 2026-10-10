import process from "node:process";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
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
