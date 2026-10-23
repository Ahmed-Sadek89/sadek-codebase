import Image from "next/image";
import { cn } from "@repo/ui/utils";
import { getInitials } from "../../../../../utils/initials";
import { isMediaUrl } from "../../../../../libs/media";

/** The dot on the timeline: the company logo (or initials); current jobs pulse. */
export function TimelineNode({
  name,
  logo,
  isCurrent,
  className,
}: {
  name: string;
  logo: string | null;
  isCurrent: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "absolute top-0 z-10 grid size-10 place-items-center sm:size-12",
        className,
      )}
    >
      {isCurrent && (
        <span
          aria-hidden="true"
          className="absolute inset-0 animate-ping rounded-full bg-primary/40 motion-reduce:animate-none"
        />
      )}
      <span
        className={cn(
          "relative grid size-full place-items-center overflow-hidden rounded-full border-2 bg-card text-xs font-black text-primary shadow-md ring-4 ring-surface",
          isCurrent ? "border-primary" : "border-border-strong",
        )}
      >
        {logo ? (
          <Image
            alt=""
            className="size-full object-cover"
            height={48}
            src={logo}
            unoptimized={!isMediaUrl(logo)}
            width={48}
          />
        ) : (
          getInitials(name)
        )}
      </span>
    </span>
  );
}
