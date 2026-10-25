"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@repo/ui/utils";
import { getInitials } from "../../../../../utils/initials";
import { isMediaUrl } from "../../../../../libs/media";

/**
 * The company logo on a light tile, padded and never cropped (`object-contain`),
 * so wide, tall and transparent logos all read well in both themes. Falls back
 * to the initials when there is no logo or it fails to load.
 */
export function CompanyLogo({
  name,
  logo,
  className,
}: {
  name: string;
  logo: string | null;
  className?: string;
}) {
  // The URL that failed, so a new `logo` is tried again.
  const [failedLogo, setFailedLogo] = useState<string | null>(null);
  const showLogo = Boolean(logo) && logo !== failedLogo;

  return (
    <span
      className={cn(
        "relative grid size-14 shrink-0 place-items-center overflow-hidden rounded-xl shadow-sm ring-1 transition duration-300 group-hover:shadow-md sm:size-16",
        showLogo
          ? "bg-white p-2 ring-black/5 dark:ring-white/10"
          : "bg-linear-to-br from-primary/15 to-primary/5 ring-primary/20",
        className,
      )}
    >
      {showLogo && logo ? (
        <Image
          alt={`${name} logo`}
          className="size-full object-contain transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none"
          height={128}
          sizes="64px"
          src={logo}
          unoptimized={!isMediaUrl(logo)}
          width={128}
          onError={() => setFailedLogo(logo)}
        />
      ) : (
        <span
          aria-hidden="true"
          className="text-lg font-black tracking-tight text-primary"
        >
          {getInitials(name) || "?"}
        </span>
      )}
    </span>
  );
}
