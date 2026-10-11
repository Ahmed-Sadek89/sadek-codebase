import {
  UPLOAD_IMAGE_TYPES,
  UPLOAD_TYPES,
} from "../../../../../libs/upload-types";

const IMAGE_EXTENSIONS = new Set(
  UPLOAD_IMAGE_TYPES.map((type) => UPLOAD_TYPES[type]),
);

/** Bytes as megabytes, rounded to one decimal (for messages and hints). */
export function bytesToMb(bytes: number) {
  return Math.round((bytes / 1024 / 1024) * 10) / 10;
}

/** The last path segment of a URL, decoded; the URL itself if it can't parse. */
export function urlFileName(url: string) {
  try {
    return decodeURIComponent(new URL(url).pathname.split("/").pop() ?? url);
  } catch {
    return url;
  }
}

/** True when the URL's file extension is an image one (e.g. ".png", not ".pdf"). */
export function isImageUrl(url: string) {
  const extension = urlFileName(url).split(".").pop()?.toLowerCase();
  return extension !== undefined && IMAGE_EXTENSIONS.has(extension);
}

/** Upper-case extension of a file name or URL, e.g. "logo.webp" → "WEBP". */
export function fileExtension(nameOrUrl: string) {
  const name = urlFileName(nameOrUrl);
  const dot = name.lastIndexOf(".");
  return dot > 0 ? name.slice(dot + 1).toUpperCase() : "";
}

/** Unique upper-case extensions for MIME types, e.g. ["image/png"] → ["PNG"]. */
export function uploadExtensions(types: string[]) {
  return [...new Set(types.map((type) => UPLOAD_TYPES[type] ?? type))].map(
    (extension) => extension.toUpperCase(),
  );
}

/** A byte count as a value and unit for `format.number(..., { style: "unit" })`. */
export function fileSizeParts(bytes: number) {
  return bytes >= 1024 * 1024
    ? { value: bytes / 1024 / 1024, unit: "megabyte" }
    : { value: Math.max(bytes / 1024, 0.1), unit: "kilobyte" };
}
