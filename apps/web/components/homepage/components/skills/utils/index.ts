import type {
  PublicCategorySkill,
  PublicCategorySkillItem,
} from "@repo/types/category-skills";

/** Chips a card shows before "+N more" (a category embeds up to 20). */
export const SKILLS_COLLAPSED_COUNT = 12;

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
