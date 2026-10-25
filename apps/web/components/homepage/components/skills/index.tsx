"use client";

import { useTranslations } from "next-intl";
import type { PublicCategorySkill } from "@repo/types/category-skills";
import type { InfiniteQueryState } from "../../utils";
import { SectionTitle } from "../../../ui/section-title";
import { SectionStatus } from "../../../ui/section-status";
import { Layers, Sparkles } from "@repo/ui/icons";
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
  const skillCount = groups.reduce((total, group) => total + group.skills.length, 0);
  return (
    <section
      id="skills"
      aria-labelledby="skills-title"
      className="relative isolate overflow-hidden bg-muted py-[76px] max-[700px]:py-[54px]"
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
        />
        {groups.length ? (
          <>
            {/* What's loaded so far: categories and skills. */}
            <ul className="mx-auto -mt-4 mb-10 flex flex-wrap justify-center gap-3">
              <li className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-4 py-2 text-sm font-semibold text-foreground shadow-sm backdrop-blur">
                <Layers aria-hidden="true" className="size-4 text-primary" />
                {t("skillsSummaryCategories", { count: groups.length })}
              </li>
              <li className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-4 py-2 text-sm font-semibold text-foreground shadow-sm backdrop-blur">
                <Sparkles aria-hidden="true" className="size-4 text-primary" />
                {t("skillsCount", { count: skillCount })}
              </li>
            </ul>
            <SkillsExplorer
              groups={groups}
              hasMore={categories.hasMore}
              isLoadingMore={categories.isLoadingMore}
              onLoadMore={categories.loadMore}
            />
          </>
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
