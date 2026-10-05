import process from "node:process";

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

export default nextConfig;
