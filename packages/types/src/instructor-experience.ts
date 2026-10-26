import type { MessageResponse } from "./auth";
import type { IsoDateString, PaginatedResponse, PaginationQuery } from "./common";
import type { Skill } from "./skills";

/** A linked skill, trimmed to `{ id, name }`. */
export interface InstructorExperienceSkillRef {
  id: number;
  name: string;
}

/** Fields shared by every instructor experience response. */
interface InstructorExperienceBase {
  id: number;
  /** Course name. Max 100 characters. */
  name: string;
  /** Max 255 characters. */
  courseLink: string;
  coverPhotoUrl: string | null;
  /** Sanitized rich-text HTML. */
  descriptionAr: string;
  descriptionEn: string;
  startAt: IsoDateString;
  /** On or after `startAt`. */
  endAt: IsoDateString;
  /** Where the course was taught, e.g. "Udemy". Max 100 characters. */
  coursePlatformName: string;
  /** Max 255 characters. */
  coursePlatformUrl: string;
  /** Display order on the website: lowest first. */
  rank: number;
  isActive: boolean;
  createdAt: IsoDateString;
  user: { id: number };
}

/** An item of GET /instructor-experience and GET /instructor-experience/:id. */
export interface InstructorExperience extends InstructorExperienceBase {
  skills: InstructorExperienceSkillRef[];
}

/** POST /instructor-experience */
export interface CreateInstructorExperienceRequest {
  name: string;
  courseLink: string;
  coverPhotoUrl?: string;
  /** Rich-text HTML; must have visible text. */
  descriptionAr: string;
  descriptionEn: string;
  /** ISO date. */
  startAt: string;
  /** ISO date on or after `startAt`. */
  endAt: string;
  coursePlatformName: string;
  coursePlatformUrl: string;
  /** Whole number ≥ 0; 0 when omitted. */
  rank?: number;
  /** Defaults to true when omitted. */
  isActive?: boolean;
  /** Non-empty, unique ids of the user's own skills. */
  skillsIds: number[];
}

/** The saved entity: skills come back as full rows (without their relations). */
export type CreateInstructorExperienceResponse = Omit<
  InstructorExperienceBase,
  "coverPhotoUrl" | "rank" | "isActive" | "createdAt" | "user"
> & {
  coverPhotoUrl?: string | null;
  rank: number;
  isActive: boolean;
  createdAt: IsoDateString;
  user: { id: number };
  skills: Omit<Skill, "user" | "categorySkills">[];
};

/**
 * GET /instructor-experience and GET /instructor-experience/public. The private
 * list sorts by `createdAt` (default DESC); the public one by `rank` (default
 * ASC, ties newest first) and returns only active rows.
 */
export interface InstructorExperiencesQuery extends PaginationQuery {
  /** Matches the course or platform name (case-insensitive). Max 20 characters. */
  search?: string;
  /** Ignored by the public list. */
  isActive?: boolean;
}

export type InstructorExperiencesResponse =
  PaginatedResponse<InstructorExperience>;

/** PATCH /instructor-experience/:id: any subset of the create fields. */
export type UpdateInstructorExperienceRequest =
  Partial<CreateInstructorExperienceRequest>;

export type UpdateInstructorExperienceResponse = MessageResponse;

/** PATCH /instructor-experience/:id/toggle-active: the row's new `isActive`. */
export type ToggleInstructorExperienceActiveResponse = MessageResponse & {
  isActive: boolean;
};

export type DeleteInstructorExperienceResponse = MessageResponse;
