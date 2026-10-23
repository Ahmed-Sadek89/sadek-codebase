import { useLocale } from "next-intl";
import type { PublicCategorySkillItem } from "@repo/types/category-skills";
import { localize } from "../../../../../utils/localize";

/** A skill pill. Plain content so the ticker and the static list can wrap it as they need. */
export function SkillChip({ skill }: { skill: PublicCategorySkillItem }) {
  const locale = useLocale();
  return (
    <span className="flex items-center gap-2 rounded-full border border-border bg-background/80 px-4 py-2 text-[13px] font-medium whitespace-nowrap text-foreground shadow-sm backdrop-blur transition-colors duration-200 hover:border-primary/50 hover:bg-primary/10 hover:text-primary sm:text-sm">
      <span
        aria-hidden="true"
        className="size-1.5 rounded-full bg-linear-to-br from-primary to-accent-strong"
      />
      <span dir="auto">{localize(locale, skill.nameEn, skill.nameAr)}</span>
    </span>
  );
}
