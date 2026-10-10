
import "server-only";
import { S3Client } from "@aws-sdk/client-s3";

export const s3 = new S3Client({
    region: process.env.AWS_REGION!,
});

export const UPLOADS_PREFIX = "projects";

export const allowedImageTypes: Record<string, string> = {
    // "image/jpeg": "jpg",
    // "image/png": "png",
    "image/webp": "webp",
    "application/pdf": "pdf",
    "application/msword": "doc",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
};
