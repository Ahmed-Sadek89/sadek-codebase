"use client";

import Image from "next/image";
import { Skeleton } from "@repo/ui/skeleton";
import { cn } from "@repo/ui/utils";
import { Link } from "../../../../i18n/navigation";
import { useBrand } from "../hooks";

/** The owner's avatar and name (GET /user-info/public), linking to the top of the homepage. */
export function BrandLink({ className }: { className?: string }) {
    const { name, initials, logoUrl, isLoading } = useBrand();
    return (
        <Link
            aria-label={name}
            className={cn(
                "group flex min-w-0 shrink items-center gap-2.5 text-foreground no-underline",
                className,
            )}
            href="#home"
        >
            <div className="relative grid size-9 shrink-0 place-items-center overflow-hidden rounded-full bg-linear-135/srgb from-primary to-accent-strong text-xs font-black text-primary-foreground shadow-sm shadow-primary/30 ring-2 ring-primary/25 transition group-hover:ring-primary/60 sm:size-10">
                {isLoading ? (
                    <Skeleton className="size-full rounded-full" />
                ) : logoUrl ? (
                    <Image
                        alt={name || ""}
                        className="size-full object-cover"
                        height={40}
                        priority
                        src={logoUrl}
                        width={40}
                    />
                ) : (
                    initials
                )}
            </div>
            {isLoading ? (
                <Skeleton className="h-4 w-24 sm:w-32" />
            ) : (
                // Long names shrink to an ellipsis instead of pushing the controls off-screen.
                <span className="max-w-[45vw] truncate text-[15px] font-extrabold tracking-tight transition-colors group-hover:text-primary sm:max-w-[220px] sm:text-[17px]">
                    {name}
                </span>
            )}
        </Link>
    );
}
