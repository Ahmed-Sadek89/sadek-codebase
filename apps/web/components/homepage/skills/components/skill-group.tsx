import type { SkillGroup as SkillGroupData } from "../utils";

export function SkillGroup({ group }: { group: SkillGroupData }) {
  return (
    <div className="mb-[15px] border-b border-border pb-[12px]">
      <div className="flex justify-between text-[10px]">
        <span>{group.category.nameEn}</span>
        <b className="text-primary">{group.skills.length}</b>
      </div>
      {group.category.descriptionEn && (
        <p className="my-1 text-[9px] text-muted-foreground">
          {group.category.descriptionEn}
        </p>
      )}
      <p className="m-0 text-[9px] text-secondary-foreground">
        {group.skills.map((skill) => skill.nameEn).join(" · ")}
      </p>
    </div>
  );
}
