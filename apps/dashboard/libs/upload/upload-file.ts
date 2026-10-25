/** What POST /api/uploads returns for a stored file. */
export type UploadedFile = {
  /** Upload id, used by DELETE /api/uploads/:id. */
  id: string;
  /** S3 key, e.g. "projects/<id>.webp". */
  key: string;
  /** Public CloudFront URL of the file. */
  url: string;
};

/**
 * Thrown by `uploadFile` when the file couldn't be stored. `reason` is
 * "tooLarge" when it is still over UPLOAD_MAX_SIZE after compression.
 */
export class UploadFileError extends Error {
  constructor(readonly reason: "tooLarge" | "failed" = "failed") {
    super(reason === "tooLarge" ? "File too large" : "File upload failed");
    this.name = "UploadFileError";
  }
}

/**
 * Stores one file through POST /api/uploads, which compresses images to WebP
 * with sharp (server side: sharp can't run in the browser) and then checks
 * the size. `variant: "og"` stores an image as a 1200×630 JPEG share image
 * instead (for SEO `ogImage`), `variant: "icon"` as a 512×512 PNG tab icon
 * (for SEO `favicon`). Throws `UploadFileError` on any failure.
 */
export async function uploadFile(
  file: File,
  { variant }: { variant?: "og" | "icon" } = {},
): Promise<UploadedFile> {
  const body = new FormData();
  body.append("file", file);
  if (variant) body.append("variant", variant);
  const response = await fetch("/api/uploads", { method: "POST", body }).catch(
    () => null,
  );
  if (response?.status === 413) throw new UploadFileError("tooLarge");
  if (!response?.ok) throw new UploadFileError();
  return (await response.json()) as UploadedFile;
}
