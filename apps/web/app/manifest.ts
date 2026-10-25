import type { MetadataRoute } from "next";
import { PWA_BACKGROUND_COLOR, PWA_NAME, PWA_SHORT_NAME } from "../libs/pwa/constants";

/**
 * /manifest.webmanifest: makes the website installable (Add to Home Screen /
 * Install app). It opens at "/", which the locale proxy sends to the
 * visitor's language; shortcuts open a language or section directly.
 */
export default function manifest(): MetadataRoute.Manifest {
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
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
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
      { name: "Projects", url: "/en#work", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
      { name: "Contact", url: "/en#contact", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
      { name: "English", url: "/en" },
      { name: "العربية", short_name: "عربي", url: "/ar" },
    ],
  };
}
