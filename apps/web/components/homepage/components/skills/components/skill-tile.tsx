import type { CSSProperties } from "react";
import type { PublicCategorySkillItem } from "@repo/types/category-skills";

/** A skill as a compact pill: its first letter in a gradient badge, then its name. Fades in after `delay` ms. */
export function SkillTile({
  skill,
  delay = 0,
}: {
  skill: PublicCategorySkillItem;
  delay?: number;
}) {
  const initial = skill.name.trim().charAt(0).toUpperCase();
  return (
    <span
      className="group/tile flex items-center gap-2 rounded-full border border-border bg-background/70 py-1 ps-1 pe-3.5 shadow-xs transition duration-200 animate-in fade-in slide-in-from-bottom-1 fill-mode-both hover:-translate-y-0.5 hover:border-primary/50 hover:bg-primary/5 hover:shadow-md hover:shadow-primary/10 motion-reduce:animate-none motion-reduce:hover:translate-y-0"
      style={{ animationDelay: `${delay}ms` } as CSSProperties}
    >
      <span
        aria-hidden="true"
        className="grid size-7 shrink-0 place-items-center rounded-full bg-linear-135/srgb from-primary/15 to-accent-strong/15 text-xs font-black text-primary transition-colors group-hover/tile:from-primary group-hover/tile:to-accent-strong group-hover/tile:text-primary-foreground"
      >
        {initial}
      </span>
      <span className="min-w-0 text-[13px] font-semibold break-words text-foreground sm:text-sm" dir="auto">
        {skill.name}
      </span>
    </span>
  );
}
