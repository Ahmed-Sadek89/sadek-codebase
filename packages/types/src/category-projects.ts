import type { MessageResponse } from "./auth";
import type {
  IsoDateString,
  PaginatedResponse,
  PaginationQuery,
} from "./common";

/** A project category as returned by GET /category-projects. */
export interface CategoryProject {
  id: number;
  nameAr: string;
  nameEn: string;
  descriptionAr: string | null;
  descriptionEn: string | null;
  isActive: boolean;
  createdAt: IsoDateString;
  user: { id: number };
}

/** POST /category-projects */
export interface CreateCategoryProjectRequest {
  /** Max 50 characters. */
  nameAr: string;
  /** Max 50 characters. */
  nameEn: string;
  descriptionAr?: string;
  descriptionEn?: string;
  isActive: boolean;
}

/** The saved entity; optional descriptions are omitted when not sent. */
export type CreateCategoryProjectResponse = Omit<
  CategoryProject,
  "descriptionAr" | "descriptionEn"
> & {
  descriptionAr?: string | null;
  descriptionEn?: string | null;
};

/**
 * GET /category-projects: the signed-in user's categories.
 * GET /category-projects/public takes the same query for the default-view user's.
 */
export interface CategoryProjectsQuery extends PaginationQuery {
  /** Matches nameAr or nameEn (case-insensitive). Max 20 characters. */
  search?: string;
  isActive?: boolean;
}

export type CategoryProjectsResponse = PaginatedResponse<CategoryProject>;

/** GET /category-projects/:id: the backend does not load `user` here. */
export type CategoryProjectDetails = Omit<CategoryProject, "user">;

/** PATCH /category-projects/:id: any subset of the create fields. */
export type UpdateCategoryProjectRequest =
  Partial<CreateCategoryProjectRequest>;

export type UpdateCategoryProjectResponse = MessageResponse;

export type DeleteCategoryProjectResponse = MessageResponse;
