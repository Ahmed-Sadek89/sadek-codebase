"use client";

import { useTranslations } from "next-intl";
import type { PublicCategorySkill } from "@repo/types/category-skills";
import type { InfiniteQueryState } from "../../utils";
import { SectionTitle } from "../../../ui/section-title";
import { SectionStatus } from "../../../ui/section-status";
import { ShowMoreButton } from "../../../ui/show-more-button";
import { SkillStream } from "./components";
import { useSkillGroups } from "./hooks";

export function Skills({
  categories,
}: {
  /**
   * GET /category-skills/public, 10 categories per page (each carries its
   * skills), plus "show more".
   */
  categories: InfiniteQueryState<PublicCategorySkill>;
}) {
  const t = useTranslations();
  const groups = useSkillGroups(categories.data);
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
          title={`${t("skillsHeadingLine1")} ${""} ${t("skillsHeadingLine2")}`}
          copy={t("skillsBody")}
        />
        {groups.length ? (
          // One streaming row per category; rows alternate direction.
          <div className="flex flex-col gap-4 sm:gap-5">
            {groups.map((group, index) => (
              <SkillStream
                group={group}
                index={index}
                key={group.category.id}
              />
            ))}
          </div>
        ) : (
          <SectionStatus
            isLoading={categories.isLoading}
            isError={categories.isError}
            emptyText={t("skillsEmpty")}
          />
        )}
        {groups.length > 0 && categories.hasMore && (
          <ShowMoreButton
            isLoading={categories.isLoadingMore}
            onClick={categories.loadMore}
          />
        )}
      </div>
    </section>
  );
}
