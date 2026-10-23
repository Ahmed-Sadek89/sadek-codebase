import type {
  PublicCategorySkill,
  PublicCategorySkillItem,
} from "@repo/types/category-skills";

export type SkillGroup = {
  category: PublicCategorySkill;
  skills: PublicCategorySkillItem[];
};

/**
 * A category's embedded skills. `?? []` keeps the page up against a backend
 * deployed before categories carried their skills.
 */
function skillsOf(category: PublicCategorySkill) {
  return category.skills ?? [];
}

/** Each category with its embedded skills; categories without skills are left out. */
export function toSkillGroups(categories: PublicCategorySkill[]): SkillGroup[] {
  return categories
    .map((category) => ({ category, skills: skillsOf(category) }))
    .filter((group) => group.skills.length > 0);
}

/**
 * Repeats a short list until it has `min` items, so a ticker row never shows
 * an empty stretch. Each copy gets its own key.
 */
export function fillTrack<T>(items: T[], min = 8) {
  if (!items.length) return [];
  const copies = Math.max(1, Math.ceil(min / items.length));
  return Array.from({ length: copies }, (_, copy) =>
    items.map((item, index) => ({ item, key: `${copy}-${index}` })),
  ).flat();
}

/** ~3.5s per chip (at least 20s): longer rows move at the same pace, not faster. */
export function tickerDuration(chips: number) {
  return `${Math.max(20, chips * 3.5)}s`;
}
