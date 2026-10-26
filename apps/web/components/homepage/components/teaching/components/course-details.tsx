import { useLocale, useTranslations } from "next-intl";
import type { InstructorExperience } from "@repo/types/instructor-experience";
import {
  ArrowUpRight,
  CalendarDays,
  ExternalLink,
  Hourglass,
  Sparkles,
} from "@repo/ui/icons";
import { cn } from "@repo/ui/utils";
import { formatCourseDate, formatCourseDuration, getHostname } from "../utils";

/** The period and its length as two chips. */
export function CourseDates({
  course,
  className,
}: {
  course: InstructorExperience;
  className?: string;
}) {
  const t = useTranslations();
  const locale = useLocale();
  return (
    <dl className={cn("flex flex-wrap items-center gap-2 text-xs font-semibold", className)}>
      <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-primary">
        <dt>
          <CalendarDays aria-hidden="true" className="size-3.5" />
          <span className="sr-only">{t("teachingPeriod")}</span>
        </dt>
        <dd>
          {formatCourseDate(course.startAt, locale)} — {formatCourseDate(course.endAt, locale)}
        </dd>
      </div>
      <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1 text-muted-foreground">
        <dt>
          <Hourglass aria-hidden="true" className="size-3.5" />
          <span className="sr-only">{t("teachingDuration")}</span>
        </dt>
        <dd>{formatCourseDuration(course, locale)}</dd>
      </div>
    </dl>
  );
}

/** "Taught on Udemy (udemy.com)", linking to the platform. */
export function CoursePlatform({ course }: { course: InstructorExperience }) {
  const t = useTranslations();
  return (
    <p className="flex flex-wrap items-center gap-x-1.5 text-sm text-muted-foreground">
      {t("teachingTaughtOn")}
      <a
        className="inline-flex items-center gap-1 font-semibold text-primary no-underline transition-colors hover:text-primary/80"
        href={course.coursePlatformUrl}
        rel="noopener noreferrer"
        target="_blank"
      >
        <span dir="auto">{course.coursePlatformName}</span>
        <span className="text-xs font-medium text-muted-foreground" dir="ltr">
          ({getHostname(course.coursePlatformUrl)})
        </span>
        <ExternalLink aria-hidden="true" className="size-3" />
      </a>
    </p>
  );
}

/** The skills taught, as chips; nothing when the course has none. */
export function CourseSkills({ course }: { course: InstructorExperience }) {
  const t = useTranslations();
  if (course.skills.length === 0) return null;
  return (
    <div className="space-y-2">
      <h4 className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground uppercase">
        <Sparkles aria-hidden="true" className="size-3.5" />
        {t("teachingSkills")}
      </h4>
      <ul className="flex flex-wrap gap-1.5">
        {course.skills.map((skill) => (
          <li
            className="rounded-full border border-border bg-surface px-2.5 py-0.5 text-xs font-medium text-foreground"
            dir="auto"
            key={skill.id}
          >
            {skill.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

/** "View course" plus a round link to the platform's website. */
export function CourseLinks({ course }: { course: InstructorExperience }) {
  const t = useTranslations();
  const platformLabel = t("teachingVisitPlatform", { platform: course.coursePlatformName });
  return (
    <div className="flex flex-wrap gap-2">
      <a
        className={`inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground no-underline shadow-md shadow-primary/25 transition duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/30 motion-reduce:hover:translate-y-0 ${focusRing}`}
        href={course.courseLink}
        rel="noopener noreferrer"
        target="_blank"
      >
        {t("teachingViewCourse")}
        <ArrowUpRight aria-hidden="true" className="size-4 rtl:-scale-x-100" />
      </a>
      <a
        className={`inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border bg-card px-5 text-sm font-semibold text-foreground no-underline shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-primary/40 motion-reduce:hover:translate-y-0 ${focusRing}`}
        href={course.coursePlatformUrl}
        rel="noopener noreferrer"
        target="_blank"
      >
        {platformLabel}
      </a>
    </div>
  );
}
