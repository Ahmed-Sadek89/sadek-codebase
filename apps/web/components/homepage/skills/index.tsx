"use client";

import { SectionTitle } from "../components/section-title";
import { SectionStatus } from "../components/section-status";
import { SkillChip, SkillGroup } from "./components";
import { useSkillsContent } from "./hooks";

export function Skills() {
  const { skills, groups, isPending } = useSkillsContent();
  return (
    <section
      id="skills"
      className="mx-auto w-full max-w-[1440px] px-4 py-[76px] max-[700px]:py-[54px] bg-muted"
    >
      <SectionTitle
        title="Skills & Tools"
        copy="The craft and software I reach for every day"
      />
      {skills.length ? (
        <div className="grid grid-cols-2 items-center gap-[65px] max-[700px]:grid-cols-1 max-[700px]:gap-5">
          <div>
            <h3 className="mb-2 text-[17px]">
              A blend of design taste and
              <br /> engineering rigor.
            </h3>
            <p className="text-[11px] leading-[1.7] text-muted-foreground">
              I move comfortably between the canvas and the codebase, which
              means I can speak to product, design and engineering teams
              fluently.
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
        <SectionStatus isPending={isPending} emptyText="No skills yet." />
      )}
    </section>
  );
}
