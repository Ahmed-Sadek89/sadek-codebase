/**
 * Installed-app (PWA) icons. They follow the tab icon uploaded in the
 * dashboard (the homepage SEO row's `favicon`): app/icons/pwa/[file]/route.tsx
 * draws each size and shape from it, and falls back to the built-in "AS"
 * icons in public/icons when none is uploaded.
 */

export type PwaIconFile = keyof typeof PWA_ICON_FILES;

export const PWA_ICON_FILES = {
  // Desktop install, app switcher, Android when the launcher can't mask.
  // Transparent, exactly like the browser tab icon.
  "any-192.png": { size: 192, kind: "any", fallback: "/icons/icon-192.png" },
  "any-512.png": { size: 512, kind: "any", fallback: "/icons/icon-512.png" },
  // Android adaptive icons: cropped to a circle/squircle, so the artwork
  // sits inside the safe zone on a solid background.
  "maskable-192.png": { size: 192, kind: "maskable", fallback: "/icons/maskable-192.png" },
  "maskable-512.png": { size: 512, kind: "maskable", fallback: "/icons/maskable-512.png" },
  // iOS home screen: no transparency (iOS would fill it with black).
  "apple-180.png": { size: 180, kind: "apple", fallback: "/icons/apple-icon-180.png" },
} as const;

export function isPwaIconFile(file: string): file is PwaIconFile {
  return Object.hasOwn(PWA_ICON_FILES, file);
}

/**
 * A short, stable tag for the uploaded icon: icon URLs change when the
 * upload changes, so installed apps and browsers fetch the new icon instead
 * of keeping the old one cached.
 */
export function pwaIconVersion(favicon: string | null | undefined): string {
  if (!favicon) return "default";
  let hash = 5381;
  for (let index = 0; index < favicon.length; index += 1) {
    hash = ((hash << 5) + hash + favicon.charCodeAt(index)) >>> 0;
  }
  return hash.toString(36);
}

/** The URL of one generated icon for this upload. */
export function pwaIconUrl(file: PwaIconFile, favicon: string | null | undefined): string {
  return `/icons/pwa/${file}?v=${pwaIconVersion(favicon)}`;
}
