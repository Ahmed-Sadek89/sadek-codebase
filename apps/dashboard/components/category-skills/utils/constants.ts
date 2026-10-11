import type {
  CategorySkill,
  CategorySkillsQuery,
} from "@repo/types/category-skills";
import type { ListQueryParams } from "../../../utils/list-query";
import type { CategorySkillFormInput } from "../schema";

/** Page size when the URL has no `?limit=`; there is no pagination UI. */
export const CATEGORY_SKILLS_LIMIT = 10;

/**
 * The list query for the URL's `search`, `page`, and `limit` (any
 * combination). Shared by the server prefetch and the client hook so both
 * build the same query key.
 */
export function getCategorySkillsQuery(
  params: ListQueryParams,
): CategorySkillsQuery {
  return { limit: CATEGORY_SKILLS_LIMIT, ...params };
}

export const CATEGORY_SKILL_FORM_DEFAULT_VALUES = {
  nameEn: "",
  nameAr: "",
  descriptionEn: "",
  descriptionAr: "",
  isActive: true,
} satisfies CategorySkillFormInput;

/** Form values for a row being edited, or the blank defaults when creating. */
export function toCategorySkillFormInput(
  category?: CategorySkill | null,
): CategorySkillFormInput {
  if (!category) return CATEGORY_SKILL_FORM_DEFAULT_VALUES;
  return {
    nameEn: category.nameEn,
    nameAr: category.nameAr,
    descriptionEn: category.descriptionEn ?? "",
    descriptionAr: category.descriptionAr ?? "",
    isActive: category.isActive,
  };
}
