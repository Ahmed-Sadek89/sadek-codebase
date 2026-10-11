
import "server-only";
import { S3Client } from "@aws-sdk/client-s3";

export const s3 = new S3Client({
    region: process.env.AWS_REGION!,
});

export const UPLOADS_PREFIX = "projects";

// Kept under this name for the API routes; the list lives in upload-types.ts
// so the upload input can share it.
export { UPLOAD_TYPES as allowedImageTypes } from "./upload-types";
