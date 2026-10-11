"use client";

import { useState } from "react";
import Image from "next/image";
import { isMediaUrl } from "../../../../libs/media";

export type AvatarCellProps = {
  /**
   * Image URL on a host from libs/image-remote-patterns.ts; the initials show when it is
   * missing, on another host, or fails to load.
   */
  src: string | null | undefined;
  /** Used for the alt text and the fallback initials. */
  name: string;
  /** "md" (40px) in table rows, "lg" (64px) e.g. in a details view. */
  size?: "md" | "lg";
};

const SIZES = {
  md: { px: 40, className: "size-10", text: "text-xs" },
  lg: { px: 64, className: "size-16", text: "text-lg" },
} as const;

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");
}

/** Round thumbnail, e.g. a skill's icon, with initials as the fallback. */
export function AvatarCell({ src, name, size = "md" }: AvatarCellProps) {
  const { px, className, text } = SIZES[size];
  // The URL that failed, so a new `src` (e.g. after an edit) is tried again.
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  // Other hosts would make next/image throw, so they get the initials too.
  const showImage = isMediaUrl(src) && src !== failedSrc;

  return (
    <span className={`relative flex ${className} shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-muted`}>
      {showImage ? (
        <Image
          src={src}
          alt={name}
          width={px}
          height={px}
          className="size-full object-cover"
          onError={() => setFailedSrc(src)}
        />
      ) : (
        <span
          className={`${text} font-medium text-muted-foreground`}
          aria-label={name}
          role="img"
        >
          {initials(name) || "?"}
        </span>
      )}
    </span>
  );
}
