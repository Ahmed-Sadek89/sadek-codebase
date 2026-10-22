import Image from "next/image";
import { cn } from "@repo/ui/utils";
import { isMediaUrl } from "../../../../../libs/media";
import type { CompanyBadge as CompanyBadgeData } from "../utils";

/**
 * A logo-only company tile. The name is not shown, but it stays the tile's
 * accessible label and hover tooltip. Without a logo, the initials stand in.
 */
export function CompanyBadge({ company }: { company: CompanyBadgeData }) {
  const content = company.logo ? (
    // Fixed tile, fitted logo: wide and square logos line up evenly.
    <span className="relative size-full rounded-full">
      <Image
        alt={company?.name || ""}
        className="object-contain opacity-60 grayscale transition duration-500 group-hover/badge:scale-105 group-hover/badge:opacity-100 group-hover/badge:grayscale-0"
        fill
        sizes="(min-width: 640px) 160px, 128px"
        src={company?.logo}
        unoptimized={!isMediaUrl(company.logo)}
      />
    </span>
  ) : (
    <span
      aria-hidden="true"
      className="text-xl font-black tracking-widest text-muted-foreground/70 transition-colors duration-500 group-hover/badge:text-primary"
    >
      {company.initials}
    </span>
  );

  const className = cn(
    "group/badge grid h-16 w-32 place-items-center rounded-2xl border border-border shadow-sm backdrop-blur",
    "transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-card hover:shadow-lg hover:shadow-primary/10",
    "sm:h-20 sm:w-40 sm:p-4",
  );

  return company.site ? (
    <a
      aria-label={company.name}
      className={cn(
        className,
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
      )}
      href={company.site}
      rel="noreferrer"
      target="_blank"
      title={company.name}
    >
      {content}
    </a>
  ) : (
    <div
      aria-label={company.name}
      className={className}
      role="img"
      title={company.name}
    >
      {content}
    </div>
  );
}
