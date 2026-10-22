import { useLocale } from "next-intl";
import type { PublicCategorySkillItem } from "@repo/types/category-skills";
import { localize } from "../../../../../utils/localize";

export function SkillChip({ skill }: { skill: PublicCategorySkillItem }) {
  const locale = useLocale();
  return (
    <span className="flex items-center gap-[5px] rounded-[20px] bg-secondary px-[9px] py-[5px] text-[9px] text-secondary-foreground">
      {localize(locale, skill.nameEn, skill.nameAr)}
    </span>
  );
}
