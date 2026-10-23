import Image from "next/image";
import { isMediaUrl } from "../../../../../libs/media";

/**
 * The cover photo filling the whole section behind its content: darkened
 * for contrast, with a soft primary glow, fading into the sections above and
 * below. A deep gradient stands in while there is no cover photo.
 */
export function CoverBackdrop({ src }: { src?: string }) {
  return (
    <div aria-hidden="true" className="absolute inset-0 -z-10">
      {src ? (
        <Image
          alt=""
          className="scale-105 object-cover"
          fill
          sizes="100vw"
          src={src}
          unoptimized={!isMediaUrl(src)}
        />
      ) : (
        <span className="absolute inset-0 bg-linear-135/srgb from-slate-950 via-slate-900 to-slate-950" />
      )}
      {/* Contrast layer and colour wash. */}
      <span className="absolute inset-0 bg-slate-950/75" />
      <span className="absolute inset-0 bg-radial-[ellipse_at_top] from-primary/35 via-transparent to-transparent" />
      <span className="absolute inset-0 bg-[radial-gradient(rgb(255_255_255/0.08)_1px,transparent_1px)] [background-size:22px_22px]" />
      {/* Blend into the neighbouring sections (page colours, outside the dark scope). */}
      <span className="absolute inset-x-0 top-0 h-24 bg-linear-to-b from-background to-transparent" />
      <span className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-muted to-transparent" />
    </div>
  );
}
