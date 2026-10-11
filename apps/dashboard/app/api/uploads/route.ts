import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "node:crypto";
import sharp from "sharp";
import { allowedImageTypes, s3, UPLOADS_PREFIX } from "../../../libs/upload/s3";
import { UPLOAD_MAX_SIZE } from "../../../libs/upload/upload-types";
import { getMediaUrl } from "../../../libs/media";
import { auth } from "../../../libs/auth";

export const runtime = "nodejs";

/** WebP quality for compressed images (0–100). */
const WEBP_QUALITY = 80;

/**
 * Server safeguard only, not a user-facing rule: the largest raw image
 * accepted for compression (the 2 MB limit applies after compressing).
 */
const RAW_IMAGE_MAX_SIZE = 25 * 1024 * 1024;

/**
 * POST /api/uploads with a multipart `file`: images are compressed to WebP
 * with sharp, other allowed files (PDF/Word) are stored as they are.
 * The stored file must be at most UPLOAD_MAX_SIZE: for images that is the
 * compressed size, so a large photo passes if its WebP fits (413 otherwise).
 * Returns `{ id, key, url }`; DELETE /api/uploads/:id removes it.
 */
export async function POST(req: NextRequest) {
    try {
        // Only signed-in dashboard users may upload.
        const session = await auth();
        if (!session?.accessToken) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const form = await req.formData().catch(() => null);
        const file = form?.get("file");
        if (
            !(file instanceof File) ||
            !Object.hasOwn(allowedImageTypes, file.type) ||
            file.size <= 0 ||
            file.size >
                (file.type.startsWith("image/") ? RAW_IMAGE_MAX_SIZE : UPLOAD_MAX_SIZE)
        ) {
            return NextResponse.json({ error: "Invalid file" }, { status: 400 });
        }

        const input = Buffer.from(await file.arrayBuffer());
        const isImage = file.type.startsWith("image/");
        let body = input;
        let contentType = file.type;
        let extension = allowedImageTypes[file.type];
        if (isImage) {
            try {
                // `animated` keeps every frame of a GIF/WebP animation.
                body = await sharp(input, { animated: true })
                    .rotate()
                    .webp({ quality: WEBP_QUALITY })
                    .toBuffer();
                contentType = "image/webp";
                extension = "webp";
            } catch {
                // e.g. ICO or HEIC, which this sharp build can't decode.
                return NextResponse.json(
                    { error: "Unsupported image" },
                    { status: 415 }
                );
            }
            // The size rule applies to the compressed image.
            if (body.length > UPLOAD_MAX_SIZE) {
                return NextResponse.json(
                    { error: "File too large" },
                    { status: 413 }
                );
            }
        }

        const id = randomUUID();
        const key = `${UPLOADS_PREFIX}/${id}.${extension}`;
        await s3.send(
            new PutObjectCommand({
                Bucket: process.env.AWS_S3_BUCKET!,
                Key: key,
                Body: body,
                ContentType: contentType,
            })
        );

        return NextResponse.json({ id, key, url: getMediaUrl(key) });
    } catch (error) {
        console.error("[uploads] Failed to upload file:", error);
        return NextResponse.json(
            { error: "Failed to upload file" },
            { status: 500 }
        );
    }
}
