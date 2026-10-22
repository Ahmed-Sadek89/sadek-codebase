import { useLocale } from "next-intl";
import { localize } from "../../../../utils/localize";
import type { SkillGroup as SkillGroupData } from "../utils";

export function SkillGroup({ group }: { group: SkillGroupData }) {
  const locale = useLocale();
  const { category, skills } = group;
  const description = localize(
    locale,
    category.descriptionEn,
    category.descriptionAr,
  );
  return (
    <div className="mb-[15px] border-b border-border pb-[12px]">
      <div className="flex justify-between text-[10px]">
        <span>{localize(locale, category.nameEn, category.nameAr)}</span>
        <b className="text-primary">{skills.length}</b>
      </div>
      {description && (
        <p className="my-1 text-[9px] text-muted-foreground">{description}</p>
      )}
      <p className="m-0 text-[9px] text-secondary-foreground">
        {skills
          .map((skill) => localize(locale, skill.nameEn, skill.nameAr))
          .join(" · ")}
      </p>
    </div>
  );
}
