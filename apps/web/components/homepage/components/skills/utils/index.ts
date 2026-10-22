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

/** Every skill across the categories once (a skill can sit in several). */
export function uniqueSkills(
  categories: PublicCategorySkill[],
): PublicCategorySkillItem[] {
  const seen = new Map<number, PublicCategorySkillItem>();
  for (const category of categories) {
    for (const skill of skillsOf(category)) {
      if (!seen.has(skill.id)) seen.set(skill.id, skill);
    }
  }
  return [...seen.values()];
}
