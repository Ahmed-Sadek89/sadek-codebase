import type { MetadataRoute } from "next";
import { PWA_BACKGROUND_COLOR, PWA_NAME, PWA_SHORT_NAME } from "../libs/pwa/constants";
import { pwaIconUrl } from "../libs/pwa/icons";
import { getHomeSeo } from "../libs/seo/seo";

// Built per request: the icons follow the tab icon uploaded in the dashboard,
// so a new upload reaches installed apps without a rebuild.
export const dynamic = "force-dynamic";

/**
 * /manifest.webmanifest: makes the website installable (Add to Home Screen /
 * Install app). It opens at "/", which the locale proxy sends to the
 * visitor's language; shortcuts open a language or section directly. The
 * icons are drawn from the uploaded tab icon (app/icons/pwa), or the built-in
 * ones without an upload.
 */
export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const favicon = (await getHomeSeo("en"))?.favicon;
  const icon192 = pwaIconUrl("any-192.png", favicon);
  return {
    id: "/",
    name: PWA_NAME,
    short_name: PWA_SHORT_NAME,
    description:
      "Portfolio of Ahmed Sadek, a full-stack developer: projects, skills, experience and contact.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "any",
    // The site's default (dark) theme, so the splash screen matches the page.
    background_color: PWA_BACKGROUND_COLOR,
    theme_color: PWA_BACKGROUND_COLOR,
    lang: "en",
    dir: "auto",
    categories: ["business", "portfolio"],
    icons: [
      { src: icon192, sizes: "192x192", type: "image/png", purpose: "any" },
      { src: pwaIconUrl("any-512.png", favicon), sizes: "512x512", type: "image/png", purpose: "any" },
      { src: pwaIconUrl("maskable-192.png", favicon), sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: pwaIconUrl("maskable-512.png", favicon), sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    // Shown in Chrome's richer install dialog on desktop.
    screenshots: [
      {
        src: "/og/home-1200x630.png",
        sizes: "1200x630",
        type: "image/png",
        form_factor: "wide",
        label: PWA_NAME,
      },
    ],
    // Long-press / right-click the app icon.
    shortcuts: [
      { name: "Projects", url: "/en#work", icons: [{ src: icon192, sizes: "192x192" }] },
      { name: "Contact", url: "/en#contact", icons: [{ src: icon192, sizes: "192x192" }] },
      { name: "English", url: "/en" },
      { name: "العربية", short_name: "عربي", url: "/ar" },
    ],
  };
}
