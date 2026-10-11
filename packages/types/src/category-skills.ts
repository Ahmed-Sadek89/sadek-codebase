import type { MessageResponse } from "./auth";
import type { IsoDateString, PaginatedResponse, PaginationQuery } from "./common";

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

/** GET /category-skills/private: the signed-in user's categories. */
export interface CategorySkillsQuery extends PaginationQuery {
  /** Matches nameAr or nameEn (case-insensitive). Max 20 characters. */
  search?: string;
  isActive?: boolean;
}

export type CategorySkillsResponse = PaginatedResponse<CategorySkill>;

/** GET /category-skills/:id: `skills` is the number of linked skills. */
export interface CategorySkillDetails extends CategorySkill {
  skills: number;
}

/** PATCH /category-skills/:id: any subset of the create fields. */
export type UpdateCategorySkillRequest = Partial<CreateCategorySkillRequest>;

export type UpdateCategorySkillResponse = MessageResponse;

/** DELETE /category-skills/:id: fails with 400 while skills still use it. */
export type DeleteCategorySkillResponse = MessageResponse;
