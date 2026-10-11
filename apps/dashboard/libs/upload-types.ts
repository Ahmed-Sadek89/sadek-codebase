/**
 * File types /api/uploads/presign accepts (MIME type → stored extension) and
 * the size cap: images in any common format, PDF, and Word files. Shared by
 * the API routes and the upload input, so the browser's checks match the
 * server's. The delete route tries every extension listed here.
 */
export const UPLOAD_TYPES: Record<string, string> = {
  // Images
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
  "image/svg+xml": "svg",
  "image/bmp": "bmp",
  "image/tiff": "tiff",
  "image/x-icon": "ico",
  "image/vnd.microsoft.icon": "ico",
  "image/heic": "heic",
  "image/heif": "heif",
  // Documents
  "application/pdf": "pdf",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
};

/** Largest upload the presign route signs: 2 MB. */
export const UPLOAD_MAX_SIZE = 2 * 1024 * 1024;

/** Every MIME type in UPLOAD_TYPES (images, PDF, Word). */
export const UPLOAD_ALL_TYPES = Object.keys(UPLOAD_TYPES);

/** The image MIME types in UPLOAD_TYPES. */
export const UPLOAD_IMAGE_TYPES = UPLOAD_ALL_TYPES.filter((type) =>
  type.startsWith("image/"),
);

/** The PDF and Word MIME types in UPLOAD_TYPES. */
export const UPLOAD_DOCUMENT_TYPES = UPLOAD_ALL_TYPES.filter(
  (type) => !type.startsWith("image/"),
);

/** What an upload field accepts: images, documents (PDF/Word), or both. */
export type UploadType = "image" | "document" | "all";

/** MIME types for each UploadType. */
export const UPLOAD_TYPES_BY_KIND: Record<UploadType, string[]> = {
  image: UPLOAD_IMAGE_TYPES,
  document: UPLOAD_DOCUMENT_TYPES,
  all: UPLOAD_ALL_TYPES,
};

/** Upper-case extensions for a hint, e.g. ["image/png", "application/pdf"] → "PNG, PDF". */
export function uploadTypesLabel(types: string[]) {
  return [...new Set(types.map((type) => UPLOAD_TYPES[type] ?? type))]
    .map((extension) => extension.toUpperCase())
    .join(", ");
}
