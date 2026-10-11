import type {
  CategoryProject,
  CategoryProjectsQuery,
} from "@repo/types/category-projects";
import type { ListQueryParams } from "../../../utils/list-query";
import type { CategoryProjectFormInput } from "../schema";

/** Page size when the URL has no `?limit=`; there is no pagination UI. */
export const CATEGORY_PROJECTS_LIMIT = 10;

/**
 * The list query for the URL's `search`, `page`, and `limit` (any
 * combination). Shared by the server prefetch and the client hook so both
 * build the same query key.
 */
export function getCategoryProjectsQuery(
  params: ListQueryParams,
): CategoryProjectsQuery {
  return { limit: CATEGORY_PROJECTS_LIMIT, ...params };
}

export const CATEGORY_PROJECT_FORM_DEFAULT_VALUES = {
  nameEn: "",
  nameAr: "",
  descriptionEn: "",
  descriptionAr: "",
  isActive: true,
} satisfies CategoryProjectFormInput;

/** Form values for a row being edited, or the blank defaults when creating. */
export function toCategoryProjectFormInput(
  category?: CategoryProject | null,
): CategoryProjectFormInput {
  if (!category) return CATEGORY_PROJECT_FORM_DEFAULT_VALUES;
  return {
    nameEn: category.nameEn,
    nameAr: category.nameAr,
    descriptionEn: category.descriptionEn ?? "",
    descriptionAr: category.descriptionAr ?? "",
    isActive: category.isActive,
  };
}
