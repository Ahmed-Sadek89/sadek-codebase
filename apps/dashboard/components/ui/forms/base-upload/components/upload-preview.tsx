"use client";

import Image from "next/image";
import { FileImage, FileText } from "@repo/ui/icons";

type UploadPreviewProps = {
  /** The saved URL or the picked file's blob URL. */
  previewSrc?: string | null;
  /** A blob URL for a just-picked file (shown with a plain <img>). */
  objectUrl?: string | null;
  isImage: boolean;
  /** Alt text for a saved image. */
  alt: string;
};

/** The 56px thumbnail: the image itself, or a file icon. */
export function UploadPreview({
  previewSrc,
  objectUrl,
  isImage,
  alt,
}: UploadPreviewProps) {
  const FileIcon = isImage ? FileImage : FileText;

  return (
    <span className="relative flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-background">
      {previewSrc && isImage ? (
        objectUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- local blob preview, not optimizable
          <img src={objectUrl} alt="" className="size-full object-cover" />
        ) : (
          <Image
            src={previewSrc}
            alt={alt}
            width={56}
            height={56}
            className="size-full object-cover"
          />
        )
      ) : (
        <FileIcon className="size-6 text-muted-foreground" aria-hidden />
      )}
    </span>
  );
}
