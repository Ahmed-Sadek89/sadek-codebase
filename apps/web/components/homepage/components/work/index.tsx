"use client";

import { useTranslations } from "next-intl";
import type { CategoryProject } from "@repo/types/category-projects";
import type { Project } from "@repo/types/projects";
import { cn } from "@repo/ui/utils";
import { SectionTitle } from "../../../ui/section-title";
import { SectionStatus } from "../../../ui/section-status";
import type { QueryState } from "../../utils";
import { CategoryFilter, ProjectCard } from "./components";

export function Work({
  projects: projectsQuery,
  categories,
  categoryId,
  onCategoryChange,
}: {
  /** `isSwitching` is true while another category loads; the previous rows stay. */
  projects: QueryState<Project[]> & { isSwitching: boolean };
  categories: QueryState<CategoryProject[]>;
  categoryId: number | undefined;
  onCategoryChange: (id: number | undefined) => void;
}) {
  const t = useTranslations();
  const { data: projects, isSwitching } = projectsQuery;
  return (
    <section
      id="work"
      className="py-[76px] max-[700px]:py-[54px] bg-background"
    >
      <div className="app-container py-0">
        <SectionTitle title={t("workTitle")} copy={t("workCopy")} />
        <CategoryFilter
          categories={categories.data}
          selectedId={categoryId}
          onSelect={onCategoryChange}
        />
        {projects.length ? (
          <div
            aria-busy={isSwitching}
            className={cn(
              "flex flex-col gap-[27px] transition-opacity",
              isSwitching && "opacity-60",
            )}
          >
            {projects.map((project, i) => (
              <ProjectCard
                key={project.id}
                project={project}
                reversed={i % 2 === 1}
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
      </div>
    </section>
  );
}
