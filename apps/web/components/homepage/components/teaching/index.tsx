"use client";

import { useTranslations } from "next-intl";
import type { InstructorExperience } from "@repo/types/instructor-experience";
import { SectionTitle } from "../../../ui/section-title";
import { SectionStatus } from "../../../ui/section-status";
import { ShowMoreButton } from "../../../ui/show-more-button";
import type { InfiniteQueryState } from "../../utils";
import { CourseShowcase } from "./components";

export function Teaching({
  courses: coursesQuery,
}: {
  /**
   * GET /instructor-experience/public, 3 courses per page (lowest rank
   * first), plus "show more". Each course is a full row; the cover alternates sides.
   */
  courses: InfiniteQueryState<InstructorExperience>;
}) {
  const t = useTranslations();
  const courses = coursesQuery.data;
  return (
    <section
      id="teaching"
      aria-labelledby="teaching-title"
      className="relative isolate overflow-hidden bg-surface py-[76px] max-[700px]:py-[54px]"
    >
      <div
        aria-hidden="true"
        className="absolute -start-32 top-1/4 -z-10 size-96 rounded-full bg-accent-strong/10 blur-3xl"
      />
      <div className="app-container py-0">
        <SectionTitle
          id="teaching-title"
          title={t("teachingTitle")}
          copy={t("teachingCopy")}
        />
        {courses.length ? (
          <ol className="mx-auto max-w-6xl space-y-8 sm:space-y-10">
            {courses.map((course, index) => (
              <li key={course.id}>
                <CourseShowcase
                  course={course}
                  index={index}
                  reversed={index % 2 === 1}
                />
              </li>
            ))}
          </ol>
        ) : (
          <SectionStatus
            isLoading={coursesQuery.isLoading}
            isError={coursesQuery.isError}
            emptyText={t("teachingEmpty")}
          />
        )}
        {courses.length > 0 && coursesQuery.hasMore && (
          <ShowMoreButton
            isLoading={coursesQuery.isLoadingMore}
            onClick={coursesQuery.loadMore}
          />
        )}
      </div>
    </section>
  );
}
