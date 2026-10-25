import type { PublicCategorySkillItem } from "@repo/types/category-skills";

/** A skill pill. */
export function SkillChip({ skill }: { skill: PublicCategorySkillItem }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-3.5 py-1.5 text-[13px] font-medium text-foreground shadow-xs transition-colors duration-200 hover:border-primary/50 hover:bg-primary/10 hover:text-primary sm:text-sm">
      <span
        aria-hidden="true"
        className="size-1.5 shrink-0 rounded-full bg-linear-to-br from-primary to-accent-strong"
      />
      <span dir="auto">{skill.name}</span>
    </span>
  );
}
