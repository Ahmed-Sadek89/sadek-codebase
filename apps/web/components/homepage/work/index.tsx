"use client";

import { useTranslations } from "next-intl";
import { cn } from "@repo/ui/utils";
import { SectionTitle } from "../components/section-title";
import { SectionStatus } from "../components/section-status";
import { CategoryFilter, ProjectCard } from "./components";
import { useWork } from "./hooks";

export function Work() {
  const t = useTranslations();
  const {
    projects,
    categories,
    categoryId,
    setCategoryId,
    isPending,
    isFetching,
  } = useWork();
  return (
    <section
      id="work"
      className="mx-auto w-full max-w-[1440px] px-4 py-[76px] max-[700px]:py-[54px] bg-background"
    >
      <SectionTitle title={t("workTitle")} copy={t("workCopy")} />
      <CategoryFilter
        categories={categories}
        selectedId={categoryId}
        onSelect={setCategoryId}
      />
      {projects.length ? (
        <div
          aria-busy={isFetching}
          className={cn(
            "flex flex-col gap-[27px] transition-opacity",
            isFetching && "opacity-60",
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
        <SectionStatus isPending={isPending} emptyText={t("workEmpty")} />
      )}
    </section>
  );
}
