import { useLocale } from "next-intl";
import type { InstructorExperience } from "@repo/types/instructor-experience";
import { GraduationCap } from "@repo/ui/icons";
import { cn } from "@repo/ui/utils";
import { localize } from "../../../../../utils/localize";
import { CollapsibleRichText } from "../../../../ui/collapsible-rich-text";
import { CourseCover } from "./course-cover";
import { CourseDates, CourseLinks, CoursePlatform, CourseSkills } from "./course-details";

/**
 * One course, in full: the framed cover beside every detail on large screens
 * (stacked on small ones), with the description clamped until "Read more".
 * `reversed` puts the cover on the other side, so rows alternate.
 */
export function CourseShowcase({
  course,
  index,
  reversed = false,
}: {
  course: InstructorExperience;
  index: number;
  reversed?: boolean;
}) {
  const locale = useLocale();
  const titleId = `course-${course.id}-title`;

  return (
    <article
      aria-labelledby={titleId}
      className={cn(
        "group grid items-start gap-6 rounded-3xl border border-border bg-card p-4 shadow-sm transition duration-300 animate-in fade-in slide-in-from-bottom-2 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 motion-reduce:animate-none sm:p-6 lg:gap-10 lg:p-8",
        reversed
          ? "lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]"
          : "lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]",
      )}
    >
      <div className={cn("relative", reversed && "lg:order-2")}>
        {/* A tilted accent card behind the cover, as in Work; it leans the other way on reversed rows. */}
        <span
          aria-hidden="true"
          className={cn(
            "absolute inset-0 rounded-2xl bg-linear-135/srgb from-primary/25 to-accent-strong/25 transition-transform duration-500 motion-reduce:transition-none",
            reversed
              ? "-rotate-2 group-hover:-rotate-3 rtl:rotate-2 rtl:group-hover:rotate-3"
              : "rotate-2 group-hover:rotate-3 rtl:-rotate-2 rtl:group-hover:-rotate-3",
          )}
        />
        <CourseCover
          className="rounded-2xl border border-border shadow-lg shadow-primary/10"
          course={course}
          sizes="(min-width: 1024px) 40vw, 100vw"
        >
          <span className="absolute start-3 top-3 inline-flex max-w-[calc(100%-1.5rem)] items-center gap-1.5 rounded-full border border-border bg-card/90 px-3 py-1 text-xs font-semibold text-foreground shadow-sm backdrop-blur">
            <GraduationCap aria-hidden="true" className="size-3.5 shrink-0 text-primary" />
            <span className="truncate" dir="auto">
              {course.coursePlatformName}
            </span>
          </span>
        </CourseCover>
      </div>

      <div className="flex min-w-0 flex-col gap-5">
        <header className="space-y-3">
          <CourseDates course={course} />
          <div className="flex items-start gap-3">
            <span
              aria-hidden="true"
              className="bg-linear-to-r from-primary to-accent-strong bg-clip-text text-3xl leading-none font-black text-transparent tabular-nums"
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3
              className="text-xl leading-tight font-bold text-foreground sm:text-2xl"
              dir="auto"
              id={titleId}
            >
              {course.name}
            </h3>
          </div>
          <CoursePlatform course={course} />
        </header>
        <CourseSkills course={course} />
        <CollapsibleRichText
          className="text-[15px] leading-7"
          html={localize(locale, course.descriptionEn, course.descriptionAr)}
        />
        <CourseLinks course={course} />
      </div>
    </article>
  );
}
