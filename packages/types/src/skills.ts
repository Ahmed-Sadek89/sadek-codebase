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
  name: string;
  isActive: boolean;
  createdAt: IsoDateString;
  user: { id: number };
  categorySkills: NamedRef[];
}

/** POST /skills */
export interface CreateSkillRequest {
  /** Max 50 characters. */
  name: string;
  isActive: boolean;
  /** At least one id; each must be one of the user's own skill categories. */
  categorySkillsIds: number[];
}

/**
 * POST /skills and PATCH /skills/:id return the saved entity. Categories
 * attached in that request come back as full category rows, which include
 * the `NamedRef` fields plus descriptions, `isActive`, and `createdAt`.
 */
export type SavedSkill = Skill;

export type CreateSkillResponse = SavedSkill;

/**
 * POST /skills/bulk: one skill per name (1–50, trimmed, unique ignoring
 * case, max 50 characters each), all with the same `isActive` and categories.
 * All or nothing.
 */
export interface CreateManySkillsRequest
  extends Omit<CreateSkillRequest, "name"> {
  names: string[];
}

/** The saved skills, in the order of `names`. */
export type CreateManySkillsResponse = SavedSkill[];

/** GET /skills; `order` sorts by `createdAt` (default DESC, newest first). */
export interface SkillsQuery extends PaginationQuery {
  /** Matches name (case-insensitive). Max 20 characters. */
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

/** PATCH /skills/:id/toggle-active: the row's new `isActive`. */
export type ToggleSkillActiveResponse = MessageResponse & {
  isActive: boolean;
};

export type DeleteSkillResponse = MessageResponse;
