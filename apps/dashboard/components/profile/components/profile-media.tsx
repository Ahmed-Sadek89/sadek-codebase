"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageIcon } from "@repo/ui/icons";
import { cn } from "@repo/ui/utils";
import { isMediaUrl } from "../../../libs/media";
import { initials } from "../utils/constants";

/**
 * A stored image on an allowed host, or a blob preview of a picked File
 * (blob URLs skip the image optimizer). Anything else shows the fallback.
 */
function useImageSrc(src: string | null | undefined) {
  // The URL that failed, so a new `src` (e.g. a new pick) is tried again.
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const isBlob = Boolean(src?.startsWith("blob:"));
  const showImage = (isBlob || isMediaUrl(src)) && src !== failedSrc;

  return {
    src: showImage ? (src as string) : null,
    unoptimized: isBlob,
    onError: () => setFailedSrc(src ?? null),
  };
}

type ProfileCoverProps = {
  src: string | null | undefined;
  alt: string;
};

/** The wide banner at the top of the profile card. */
export function ProfileCover({ src, alt }: ProfileCoverProps) {
  const image = useImageSrc(src);

  return (
    <div className="relative h-32 overflow-hidden bg-primary-muted sm:h-44">
      {image.src ? (
        <Image
          src={image.src}
          alt={alt}
          fill
          sizes="(min-width: 72rem) 72rem, 100vw"
          unoptimized={image.unoptimized}
          className="object-cover"
          onError={image.onError}
        />
      ) : (
        <ImageIcon
          className="absolute end-6 top-1/2 size-16 -translate-y-1/2 text-primary opacity-20 sm:size-20"
          aria-hidden
        />
      )}
    </div>
  );
}

type ProfileAvatarProps = {
  src: string | null | undefined;
  /** Used for the alt text and the fallback initials. */
  name: string;
  className?: string;
};

/** The large round avatar that overlaps the cover. */
export function ProfileAvatar({ src, name, className }: ProfileAvatarProps) {
  const image = useImageSrc(src);

  return (
    <span
      className={cn(
        "relative flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-full bg-secondary ring-4 ring-card sm:size-28",
        className,
      )}
    >
      {image.src ? (
        <Image
          src={image.src}
          alt={name}
          fill
          sizes="112px"
          unoptimized={image.unoptimized}
          className="object-cover"
          onError={image.onError}
        />
      ) : (
        <span
          role="img"
          aria-label={name}
          className="text-2xl font-semibold text-secondary-foreground sm:text-3xl"
        >
          {initials(name) || "?"}
        </span>
      )}
    </span>
  );
}
