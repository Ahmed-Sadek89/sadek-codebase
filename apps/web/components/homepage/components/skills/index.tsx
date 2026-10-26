"use client";

import { useTranslations } from "next-intl";
import type { PublicCategorySkill } from "@repo/types/category-skills";
import type { InfiniteQueryState } from "../../utils";
import { SectionTitle } from "../../../ui/section-title";
import { SectionStatus } from "../../../ui/section-status";
import { SkillsExplorer } from "./components";
import { useSkillGroups } from "./hooks";

export function Skills({
  categories,
}: {
  /**
   * GET /category-skills/public, 5 categories per page (each carries its
   * skills), plus "more categories".
   */
  categories: InfiniteQueryState<PublicCategorySkill>;
}) {
  const t = useTranslations();
  const groups = useSkillGroups(categories.data);
  return (
    <section
      id="skills"
      aria-labelledby="skills-title"
      className="relative isolate overflow-hidden bg-muted py-14 sm:py-16"
    >
      <div
        aria-hidden="true"
        className="absolute -start-32 top-1/4 -z-10 size-96 rounded-full bg-primary/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -end-24 bottom-0 -z-10 size-80 rounded-full bg-accent-strong/10 blur-3xl"
      />
      <div className="app-container py-0">
        <SectionTitle
          id="skills-title"
          title={`${t("skillsHeadingLine1")} ${t("skillsHeadingLine2")}`}
          copy={t("skillsBody")}
          className="mb-8 sm:mb-10"
        />
        {groups.length ? (
          <SkillsExplorer
            groups={groups}
            hasMore={categories.hasMore}
            isLoadingMore={categories.isLoadingMore}
            onLoadMore={categories.loadMore}
          />
        ) : (
          <SectionStatus
            isLoading={categories.isLoading}
            isError={categories.isError}
            emptyText={t("skillsEmpty")}
          />
        )}
      </div>
    </section>
  );
}
