
import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "node:crypto";
import { allowedImageTypes, s3, UPLOADS_PREFIX } from "../../../../libs/s3";

export const runtime = "nodejs";

const MAX_SIZE = 2 * 1024 * 1024;

export async function POST(req: NextRequest) {
    try {
        // TODO: Verify session and upload permission here.
        // Never expose this endpoint without authentication.

        const body = await req.json().catch(() => null);
        const { type, size } = body ?? {};

        if (
            typeof type !== "string" ||
            !Object.hasOwn(allowedImageTypes, type) ||
            !Number.isInteger(size) ||
            size <= 0 ||
            size > MAX_SIZE
        ) {
            return NextResponse.json(
                { error: "Invalid file" },
                { status: 400 }
            );
        }

        const id = randomUUID();
        const key = `${UPLOADS_PREFIX}/${id}.${allowedImageTypes[type]}`;

        const command = new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET!,
            Key: key,
            ContentType: type,
        });

        const uploadUrl = await getSignedUrl(s3, command, {
            expiresIn: 60,
        });

        return NextResponse.json({
            uploadUrl,
            id,
            key,
        });
    } catch (error) {
        console.error("[uploads/presign] Failed to generate upload URL:", error);
        return NextResponse.json(
            { error: "Failed to generate upload URL" },
            { status: 500 }
        );
    }
}
