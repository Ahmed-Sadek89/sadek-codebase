import type { MessageResponse } from "./auth";
import type {
  IsoDateString,
  PaginatedResponse,
  PaginationQuery,
} from "./common";

/** A website page without its owner (GET /pages/:id). */
export interface PageDetails {
  id: number;
  /** Max 50 characters, unique across all pages. */
  name_en: string;
  /** Max 50 characters, unique across all pages. */
  name_ar: string;
  createdAt: IsoDateString;
}

/** An item of GET /pages. */
export interface Page extends PageDetails {
  user: { id: number };
}

/** The trimmed page embedded in SEO rows. */
export type PageRef = Pick<PageDetails, "id" | "name_en" | "name_ar">;

/** POST /pages: both names required; a taken name returns 409. */
export interface CreatePageRequest {
  name_en: string;
  name_ar: string;
}

export type CreatePageResponse = Page;

/** GET /pages; `order` sorts by `createdAt` (default DESC). */
export interface PagesQuery extends PaginationQuery {
  /** Matches name_en or name_ar (case-insensitive). Max 20 characters. */
  search?: string;
}

export type PagesResponse = PaginatedResponse<Page>;

/** PATCH /pages/:id: any subset of the names; a taken name returns 409. */
export type UpdatePageRequest = Partial<CreatePageRequest>;

export type UpdatePageResponse = MessageResponse;

/** DELETE /pages/:id; the page's SEO row is deleted with it. */
export type DeletePageResponse = MessageResponse;
