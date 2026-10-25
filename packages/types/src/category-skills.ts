import type { MessageResponse } from "./auth";
import type {
  IsoDateString,
  PaginatedResponse,
  PaginationQuery,
} from "./common";

/** A skill category as returned by the backend `category_skills` entity. */
export interface CategorySkill {
  id: number;
  nameAr: string;
  nameEn: string;
  /** Nullable column: `null` when it was never set. */
  descriptionAr: string | null;
  descriptionEn: string | null;
  isActive: boolean;
  createdAt: IsoDateString;
  /** Only the owner's id is selected. */
  user: { id: number };
}

/** POST /category-skills */
export interface CreateCategorySkillRequest {
  /** Max 50 characters. */
  nameAr: string;
  /** Max 50 characters. */
  nameEn: string;
  descriptionAr?: string;
  descriptionEn?: string;
  isActive: boolean;
}

/** The saved entity; optional descriptions are omitted when not sent. */
export type CreateCategorySkillResponse = Omit<
  CategorySkill,
  "descriptionAr" | "descriptionEn"
> & {
  descriptionAr?: string | null;
  descriptionEn?: string | null;
};

/**
 * GET /category-skills/private: the signed-in user's categories.
 * GET /category-skills/public takes the same query for the default-view user's
 * (each with its skills, see PublicCategorySkill).
 */
export interface CategorySkillsQuery extends PaginationQuery {
  /** Matches nameAr or nameEn (case-insensitive). Max 20 characters. */
  search?: string;
  isActive?: boolean;
}

export type CategorySkillsResponse = PaginatedResponse<CategorySkill>;

/** A skill embedded in a GET /category-skills/public category (active skills only). */
export interface PublicCategorySkillItem {
  id: number;
  nameAr: string;
  nameEn: string;
  createdAt: IsoDateString;
}

/** GET /category-skills/public item: the category with up to 20 of its active skills, newest first. */
export interface PublicCategorySkill extends CategorySkill {
  skills: PublicCategorySkillItem[];
}

export type PublicCategorySkillsResponse =
  PaginatedResponse<PublicCategorySkill>;

/** GET /category-skills/:id: `skills` is the number of linked skills. */
export interface CategorySkillDetails extends CategorySkill {
  skills: number;
}

/** PATCH /category-skills/:id: any subset of the create fields. */
export type UpdateCategorySkillRequest = Partial<CreateCategorySkillRequest>;

export type UpdateCategorySkillResponse = MessageResponse;

/** DELETE /category-skills/:id: fails with 400 while skills still use it. */
/** PATCH /category-skills/:id/toggle-active: the row's new `isActive`. */
export type ToggleCategorySkillActiveResponse = MessageResponse & {
  isActive: boolean;
};

export type DeleteCategorySkillResponse = MessageResponse;
