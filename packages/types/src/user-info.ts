import type { MessageResponse } from "./auth";
import type {
  IsoDateString,
  PaginatedResponse,
  PaginationQuery,
} from "./common";

/** GET /user-info/:id and GET /user-info/me: the row without its owner. */
export interface UserInfoDetails {
  id: number;
  /** Max 100 characters. */
  headTitle: string;
  /** Max 255 characters. */
  shortDescription: string;
  description: string;
  yearsOfExp: number;
  companies: number;
  projectNumbers: number;
  techMastering: number;
  gmail: string | null;
  linkedin: string | null;
  github: string | null;
  cv: string | null;
  createdAt: IsoDateString;
}

/** An item of GET /user-info: includes the owner as `user: { id }`. */
export interface UserInfo extends UserInfoDetails {
  user: { id: number };
}

/** POST /user-info: creates the signed-in user's single row. */
export interface CreateUserInfoRequest {
  /** Max 100 characters. */
  headTitle: string;
  /** Max 255 characters. */
  shortDescription: string;
  description: string;
  /** Integers, 0 or more. */
  yearsOfExp: number;
  companies: number;
  projectNumbers: number;
  techMastering: number;
  /** Valid email, max 255 characters. */
  gmail?: string;
  /** http(s) URLs, max 255 characters each. */
  linkedin?: string;
  github?: string;
  cv?: string;
}

/** The saved row; optional fields are omitted when not sent. */
export type CreateUserInfoResponse = Omit<
  UserInfo,
  "gmail" | "linkedin" | "github" | "cv"
> & {
  gmail?: string | null;
  linkedin?: string | null;
  github?: string | null;
  cv?: string | null;
};

/** GET /user-info; `order` sorts by `createdAt` (default DESC). */
export type UserInfoQuery = PaginationQuery;

/** Every user's row, not only the signed-in user's. */
export type UserInfoResponse = PaginatedResponse<UserInfo>;

/** GET /user-info/me: 404 until the signed-in user creates their row. */
export type MyUserInfoResponse = UserInfoDetails;

/**
 * PATCH /user-info/:id: any subset of the create fields. `null` clears an
 * optional contact field (omitting it keeps the current one).
 */
export type UpdateUserInfoRequest = Partial<
  Omit<CreateUserInfoRequest, "gmail" | "linkedin" | "github" | "cv">
> & {
  gmail?: string | null;
  linkedin?: string | null;
  github?: string | null;
  cv?: string | null;
};

export type UpdateUserInfoResponse = MessageResponse;

export type DeleteUserInfoResponse = MessageResponse;
