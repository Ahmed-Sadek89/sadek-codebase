"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@repo/ui/utils";
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
  md: { px: 40, className: "size-10", text: "text-sm" },
  lg: { px: 64, className: "size-16", text: "text-2xl" },
} as const;

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");
}

/**
 * Square thumbnail, e.g. a skill's icon or a company logo, with no frame:
 * the whole image fits the box (never cropped), and the initials stand in
 * when there is no usable image.
 */
export function AvatarCell({ src, name, size = "md" }: AvatarCellProps) {
  const { px, className, text } = SIZES[size];
  // The URL that failed, so a new `src` (e.g. after an edit) is tried again.
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  // Other hosts would make next/image throw, so they get the initials too.
  const showImage = isMediaUrl(src) && src !== failedSrc;

  return (
    <span
      className={cn(
        "relative flex shrink-0 items-center justify-center select-none",
        className,
      )}
    >
      {showImage ? (
        <Image
          src={src}
          alt={name}
          // 2x the box for sharp logos on high-density screens.
          width={px * 2}
          height={px * 2}
          sizes={`${px}px`}
          className="size-full object-contain drop-shadow-sm"
          draggable={false}
          onError={() => setFailedSrc(src)}
        />
      ) : (
        <span
          className={cn(
            text,
            "font-bold leading-none tracking-tight text-primary/80",
          )}
          aria-label={name}
          role="img"
        >
          {initials(name) || "?"}
        </span>
      )}
    </span>
  );
}
