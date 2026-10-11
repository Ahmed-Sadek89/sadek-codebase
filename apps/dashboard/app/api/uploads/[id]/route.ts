
import { NextRequest, NextResponse } from "next/server";
import { DeleteObjectsCommand } from "@aws-sdk/client-s3";
import { allowedImageTypes, s3, UPLOADS_PREFIX } from "../../../../libs/upload/s3";
import { auth } from "../../../../libs/auth";

export const runtime = "nodejs";

const UUID_REGEX =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function DELETE(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Only signed-in dashboard users may delete uploads.
        const session = await auth();
        if (!session?.accessToken) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

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
                    // Several MIME types share an extension (e.g. .ico), so dedupe.
                    Objects: [...new Set(Object.values(allowedImageTypes))].map((ext) => ({
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
