import Image from "next/image";
import type { Skill } from "@repo/types/skills";

export function SkillChip({ skill }: { skill: Skill }) {
  return (
    <span className="flex items-center gap-[5px] rounded-[20px] bg-secondary px-[9px] py-[5px] text-[9px] text-secondary-foreground">
      {skill.avatar_url && (
        <Image
          alt=""
          className="size-3 object-contain"
          height={12}
          src={skill.avatar_url}
          unoptimized
          width={12}
        />
      )}
      {skill.nameEn}
    </span>
  );
}
