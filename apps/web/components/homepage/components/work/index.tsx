"use client";

import { useTranslations } from "next-intl";
import type { CategoryProject } from "@repo/types/category-projects";
import type { Project } from "@repo/types/projects";
import { SectionTitle } from "../../../ui/section-title";
import { SectionStatus } from "../../../ui/section-status";
import { ShowMoreButton } from "../../../ui/show-more-button";
import type { InfiniteQueryState } from "../../utils";
import { cn } from "@repo/ui/utils";
import { CategoryFilter, ProjectShowcase } from "./components";

export function Work({
  projects: projectsQuery,
  categories,
  categoryId,
  onCategoryChange,
}: {
  /**
   * GET /projects/public for the selected category, 3 per page, plus "show
   * more". `isSwitching` is true while another category loads; the previous
   * projects stay on screen meanwhile.
   */
  projects: InfiniteQueryState<Project> & { isSwitching: boolean };
  /** GET /category-projects/public, 10 chips per page, plus "show more". */
  categories: InfiniteQueryState<CategoryProject>;
  categoryId: number | undefined;
  onCategoryChange: (id: number | undefined) => void;
}) {
  const t = useTranslations();
  const projects = projectsQuery.data;
  return (
    <section
      id="work"
      aria-labelledby="work-title"
      className="relative isolate bg-background py-[76px] max-[700px]:py-[54px]"
    >
      <div
        aria-hidden="true"
        className="absolute end-0 top-40 -z-10 size-96 rounded-full bg-primary/10 blur-3xl"
      />
      {/* Faint dot grid behind the gallery, fading out toward the edges. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)] bg-[radial-gradient(var(--border-strong)_1px,transparent_1px)] [background-size:22px_22px] opacity-60"
      />
      <div className="app-container py-0">
        <SectionTitle
          id="work-title"
          title={t("workTitle")}
          copy={t("workCopy")}
        />
        <CategoryFilter
          categories={categories.data}
          selectedId={categoryId}
          onSelect={onCategoryChange}
          hasMore={categories.hasMore}
          isLoadingMore={categories.isLoadingMore}
          onLoadMore={categories.loadMore}
        />
        {projects.length ? (
          // One full-width row per project, alternating sides; dims while another category loads.
          <div
            aria-busy={projectsQuery.isSwitching}
            className={cn(
              "space-y-20 transition-opacity duration-300 max-[700px]:space-y-14 lg:space-y-28",
              projectsQuery.isSwitching && "opacity-60",
            )}
          >
            {projects.map((project, index) => (
              <ProjectShowcase
                index={index}
                key={project.id}
                project={project}
                reversed={index % 2 === 1}
              />
            ))}
          </div>
        ) : (
          <SectionStatus
            isLoading={projectsQuery.isLoading}
            isError={projectsQuery.isError}
            emptyText={t("workEmpty")}
          />
        )}
        {projects.length > 0 && projectsQuery.hasMore && (
          <ShowMoreButton
            isLoading={projectsQuery.isLoadingMore}
            onClick={projectsQuery.loadMore}
          />
        )}
      </div>
    </section>
  );
}
