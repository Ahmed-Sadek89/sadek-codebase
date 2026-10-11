import type { Skill, SkillsQuery } from "@repo/types/skills";
import {
  readListQueryParams,
  readPositiveInt,
  type ParamReader,
} from "../../../utils/list-query";
import { CATEGORY_ID_PARAM } from "../../../utils/constants";
import type { SkillFormInput } from "../schema";

/** Page size when the URL has no `?limit=`. */
export const SKILLS_LIMIT = 10;

/**
 * The list query for the URL's `search`, `page`, `limit`, `order`,
 * `isActive`, and `categoryId` (any combination). Shared by the server
 * prefetch and the client hook so both build the same query key.
 * `categoryId` is read here, not in readListQueryParams, because only
 * GET /skills accepts it (other list endpoints reject unknown params).
 */
export function getSkillsQuery(get: ParamReader): SkillsQuery {
  const categoryId = readPositiveInt(get(CATEGORY_ID_PARAM));
  return {
    limit: SKILLS_LIMIT,
    ...readListQueryParams(get),
    ...(categoryId !== undefined && { categoryId }),
  };
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
