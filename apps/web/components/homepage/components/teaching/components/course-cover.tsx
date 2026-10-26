import Image from "next/image";
import type { InstructorExperience } from "@repo/types/instructor-experience";
import { GraduationCap } from "@repo/ui/icons";
import { cn } from "@repo/ui/utils";
import { isMediaUrl } from "../../../../../libs/media";

/**
 * A course's 16:10 cover: the photo, or an accent tile with the cap icon
 * (and, when `showName`, the course name). The frame comes from `className`.
 */
export function CourseCover({
  course,
  sizes,
  showName = true,
  className,
  children,
}: {
  course: InstructorExperience;
  /** next/image `sizes` for the rendered width. */
  sizes: string;
  showName?: boolean;
  className?: string;
  /** Overlays such as the platform badge. */
  children?: React.ReactNode;
}) {
  return (
    <div className={cn("relative aspect-[16/10] overflow-hidden bg-muted", className)}>
      {course.coverPhotoUrl ? (
        <Image
          alt={course.name}
          className="object-cover transition duration-700 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          fill
          sizes={sizes}
          src={course.coverPhotoUrl}
          unoptimized={!isMediaUrl(course.coverPhotoUrl)}
        />
      ) : (
        <div className="flex size-full flex-col items-center justify-center gap-2 bg-linear-135/srgb from-primary/20 to-accent-strong/20 p-3 text-center">
          <GraduationCap aria-hidden="true" className="size-1/4 max-h-12 text-primary/70" />
          {showName && (
            <span className="line-clamp-2 text-lg font-black text-primary/70" dir="auto">
              {course.name}
            </span>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
