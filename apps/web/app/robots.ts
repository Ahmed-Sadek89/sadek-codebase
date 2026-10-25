import type { MetadataRoute } from "next";
import { getSiteUrl } from "../libs/seo/site";

/**
 * /robots.txt: the whole website is public, so every crawler may visit every
 * page except Next.js internals; points crawlers to the sitemap. Per-page
 * indexing is still controlled by each page's robots meta tag (the SEO row's
 * robotsIndex / robotsFollow).
 */
export default function robots(): MetadataRoute.Robots {
  const site = getSiteUrl();
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/_next/"] }],
    sitemap: `${site}/sitemap.xml`,
    host: site,
  };
}
