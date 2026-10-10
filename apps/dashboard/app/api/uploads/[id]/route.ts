
import { NextRequest, NextResponse } from "next/server";
import { DeleteObjectsCommand } from "@aws-sdk/client-s3";
import { allowedImageTypes, s3, UPLOADS_PREFIX } from "../../../../libs/s3";

export const runtime = "nodejs";

const UUID_REGEX =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function DELETE(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // TODO: Verify session and delete permission here.
        // Never expose this endpoint without authentication.

        const { id } = await params;

        // Strict UUID check keeps the id from escaping the uploads prefix.
        if (!UUID_REGEX.test(id)) {
            return NextResponse.json(
                { error: "Invalid id" },
                { status: 400 }
            );
        }

        // Only the id is known, not the extension, so delete every
        // candidate key. S3 deletes are idempotent: missing keys succeed.
        const { Errors } = await s3.send(
            new DeleteObjectsCommand({
                Bucket: process.env.AWS_S3_BUCKET!,
                Delete: {
                    Objects: Object.values(allowedImageTypes).map((ext) => ({
                        Key: `${UPLOADS_PREFIX}/${id.toLowerCase()}.${ext}`,
                    })),
                    Quiet: true,
                },
            })
        );

        if (Errors?.length) {
            throw new Error(
                Errors.map((e) => `${e.Key}: ${e.Code} ${e.Message}`).join("; ")
            );
        }

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error("[uploads/delete] Failed to delete upload:", error);
        return NextResponse.json(
            { error: "Failed to delete upload" },
            { status: 500 }
        );
    }
}
