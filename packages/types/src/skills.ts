import type {
  IsoDateString,
  NamedRef,
  PaginatedResponse,
  PaginationQuery,
} from "./common";
import type { MessageResponse } from "./auth";

/**
 * A skill as returned by GET /skills and GET /skills/:id.
 * Every skill route is scoped to the signed-in user.
 */
export interface Skill {
  id: number;
  nameAr: string;
  nameEn: string;
  /** snake_case on the backend; nullable URL. */
  avatar_url: string | null;
  isActive: boolean;
  createdAt: IsoDateString;
  user: { id: number };
  categorySkills: NamedRef[];
}

/** POST /skills */
export interface CreateSkillRequest {
  /** Max 50 characters. */
  nameAr: string;
  /** Max 50 characters. */
  nameEn: string;
  /** Must be a URL. */
  avatar_url?: string;
  isActive: boolean;
  /** At least one id; each must be one of the user's own skill categories. */
  categorySkillsIds: number[];
}

/**
 * POST /skills and PATCH /skills/:id return the saved entity. Categories
 * attached in that request come back as full category rows, which include
 * the `NamedRef` fields plus descriptions, `isActive`, and `createdAt`.
 */
export type SavedSkill = Omit<Skill, "avatar_url"> & {
  avatar_url?: string | null;
};

export type CreateSkillResponse = SavedSkill;

/** GET /skills; `order` is accepted but ignored (always newest first). */
export interface SkillsQuery extends PaginationQuery {
  /** Matches nameAr or nameEn (case-insensitive). Max 20 characters. */
  search?: string;
  isActive?: boolean;
  /** Only skills linked to this skill category. */
  categoryId?: number;
}

export type SkillsResponse = PaginatedResponse<Skill>;

/**
 * PATCH /skills/:id: any subset of the create fields. Omit
 * `categorySkillsIds` to keep the current categories; `[]` is rejected.
 */
export type UpdateSkillRequest = Partial<CreateSkillRequest>;

/** Unlike other modules, the update returns the saved skill, not a message. */
export type UpdateSkillResponse = SavedSkill;

export type DeleteSkillResponse = MessageResponse;
