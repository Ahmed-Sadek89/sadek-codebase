import type { CategorySkill } from "@repo/types/category-skills";
import type { Skill } from "@repo/types/skills";

export type SkillGroup = { category: CategorySkill; skills: Skill[] };

/** Each category with the skills linked to it; categories without skills are left out. */
export function groupSkillsByCategory(
  categories: CategorySkill[],
  skills: Skill[],
): SkillGroup[] {
  return categories
    .map((category) => ({
      category,
      skills: skills.filter((skill) =>
        skill.categorySkills.some((ref) => ref.id === category.id),
      ),
    }))
    .filter((group) => group.skills.length > 0);
}
