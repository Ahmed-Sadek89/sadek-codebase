"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { useFormatter, useTranslations } from "next-intl";
import type { InstructorExperience } from "@repo/types/instructor-experience";
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import {
  CalendarCheck,
  CalendarPlus,
  ExternalLink,
  GraduationCap,
  Hourglass,
  ImageOff,
} from "@repo/ui/icons";
import { isMediaUrl } from "../../../libs/media";
import { getDuration } from "../utils/duration";

const DATE_FORMAT = { day: "numeric", month: "long", year: "numeric" } as const;

function Stat({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border bg-muted/30 px-3 py-2.5">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-semibold">{value}</p>
      </div>
    </div>
  );
}

/** Cover photo, course name and platform, the link to the course, and the teaching period. */
export function CourseHero({
  instructorExperience,
}: {
  instructorExperience: InstructorExperience;
}) {
  const t = useTranslations();
  const format = useFormatter();
  const { name, coverPhotoUrl, courseLink, coursePlatformName, coursePlatformUrl, startAt, endAt } =
    instructorExperience;
  const duration = getDuration(startAt, endAt);
  const durationText =
    duration.unit === "months"
      ? t("instructorExperienceDurationMonths", { count: duration.count })
      : duration.unit === "weeks"
        ? t("instructorExperienceDurationWeeks", { count: duration.count })
        : t("instructorExperienceDurationDays", { count: duration.count });

  return (
    <Card className="gap-0 overflow-hidden p-0">
      {/* next/image throws for hosts outside the allowed patterns. */}
      {isMediaUrl(coverPhotoUrl) ? (
        <Image
          src={coverPhotoUrl}
          alt={name}
          width={1200}
          height={630}
          priority
          className="aspect-[1200/630] w-full object-cover"
        />
      ) : (
        <div className="flex aspect-[1200/630] w-full flex-col items-center justify-center gap-2 bg-muted/40 text-muted-foreground">
          <ImageOff className="size-10" aria-hidden />
          <span className="text-sm">{t("instructorExperienceViewNoCover")}</span>
        </div>
      )}

      <div className="space-y-5 p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 space-y-2">
            <a
              href={coursePlatformUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary hover:bg-primary/15"
            >
              <GraduationCap className="size-3.5 shrink-0" aria-hidden />
              <span className="truncate" dir="auto">
                {coursePlatformName}
              </span>
            </a>
            <h2 className="text-xl font-semibold sm:text-2xl" dir="auto">
              {name}
            </h2>
          </div>
          <Button asChild className="w-full sm:w-auto">
            <a href={courseLink} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="size-4" aria-hidden />
              {t("instructorExperienceViewOpenCourse")}
            </a>
          </Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <Stat
            icon={<CalendarPlus className="size-4" aria-hidden />}
            label={t("instructorExperienceFormStartLabel")}
            value={format.dateTime(new Date(startAt), DATE_FORMAT)}
          />
          <Stat
            icon={<CalendarCheck className="size-4" aria-hidden />}
            label={t("instructorExperienceFormEndLabel")}
            value={format.dateTime(new Date(endAt), DATE_FORMAT)}
          />
          <Stat
            icon={<Hourglass className="size-4" aria-hidden />}
            label={t("instructorExperienceViewDuration")}
            value={durationText}
          />
        </div>
      </div>
    </Card>
  );
}
