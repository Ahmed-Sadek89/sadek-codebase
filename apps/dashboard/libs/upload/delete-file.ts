import { getMediaUrl } from "../media";
import { UPLOADS_PREFIX } from "./upload-types";

const UPLOAD_ID =
  /\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\.[a-z]+$/i;

/**
 * Deletes a file stored by `uploadFile`, by the id in its URL, through
 * DELETE /api/uploads/:id. URLs from elsewhere (e.g. seeded picsum images)
 * and empty values are ignored. Best effort, never throws: a failed delete
 * only leaves an unused file in the bucket.
 */
export async function deleteFile(url: string | null | undefined) {
  if (!url?.startsWith(getMediaUrl(`${UPLOADS_PREFIX}/`))) return;
  const id = UPLOAD_ID.exec(url)?.[1];
  if (!id) return;
  await fetch(`/api/uploads/${id}`, { method: "DELETE" }).catch(() => {});
}
