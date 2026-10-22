"use client";

import { useTranslations } from "next-intl";
import type { CategorySkill } from "@repo/types/category-skills";
import type { Skill } from "@repo/types/skills";
import type { QueryState } from "../../utils";
import { SectionTitle } from "../../../ui/section-title";
import { SectionStatus } from "../../../ui/section-status";
import { SkillChip, SkillGroup } from "./components";
import { useSkillGroups } from "./hooks";

export function Skills({
  skills: skillsQuery,
  categories,
}: {
  skills: QueryState<Skill[]>;
  categories: QueryState<CategorySkill[]>;
}) {
  const t = useTranslations();
  const skills = skillsQuery.data;
  const groups = useSkillGroups(categories.data, skills);
  return (
    <section id="skills" className="py-[76px] max-[700px]:py-[54px] bg-muted">
      <div className="app-container py-0">
        <SectionTitle title={t("skillsTitle")} copy={t("skillsCopy")} />
        {skills.length ? (
          <div className="grid grid-cols-2 items-center gap-[65px] max-[700px]:grid-cols-1 max-[700px]:gap-5">
            <div>
              <h3 className="mb-2 text-[17px]">
                {t("skillsHeadingLine1")}
                <br /> {t("skillsHeadingLine2")}
              </h3>
              <p className="text-[11px] leading-[1.7] text-muted-foreground">
                {t("skillsBody")}
              </p>
              <div className="flex flex-wrap gap-[7px]">
                {skills.map((skill) => (
                  <SkillChip key={skill.id} skill={skill} />
                ))}
              </div>
            </div>
            <div>
              {groups.map((group) => (
                <SkillGroup key={group.category.id} group={group} />
              ))}
            </div>
          </div>
        ) : (
          <SectionStatus
            isLoading={skillsQuery.isLoading}
            isError={skillsQuery.isError}
            emptyText={t("skillsEmpty")}
          />
        )}
      </div>
    </section>
  );
}
