import type { Skill, SkillsQuery } from "@repo/types/skills";
import type { ListQueryParams } from "../../../utils/list-query";
import type { SkillFormInput } from "../schema";

/** Page size when the URL has no `?limit=`. */
export const SKILLS_LIMIT = 10;

/**
 * The list query for the URL's `search`, `page`, `limit`, `order`, and
 * `isActive` (any combination). Shared by the server prefetch and the client
 * hook so both build the same query key.
 */
export function getSkillsQuery(params: ListQueryParams): SkillsQuery {
  return { limit: SKILLS_LIMIT, ...params };
}

export const SKILL_FORM_DEFAULT_VALUES = {
  nameEn: "",
  nameAr: "",
  avatar_url: "",
  isActive: true,
  categorySkills: [],
} satisfies SkillFormInput;

/** Form values for a row being edited, or the blank defaults when creating. */
export function toSkillFormInput(skill?: Skill | null): SkillFormInput {
  if (!skill) return SKILL_FORM_DEFAULT_VALUES;
  return {
    nameEn: skill.nameEn,
    nameAr: skill.nameAr,
    avatar_url: skill.avatar_url ?? "",
    isActive: skill.isActive,
    categorySkills: skill.categorySkills.map(({ id, nameAr, nameEn }) => ({
      id,
      nameAr,
      nameEn,
    })),
  };
}
