import type { MessageResponse } from "./auth";
import type {
  IsoDateString,
  PaginatedResponse,
  PaginationQuery,
} from "./common";

/** GET /user-info/:id and GET /user-info/me: the row without its owner. */
export interface UserInfoDetails {
  id: number;
  /** Max 100 characters each. */
  headTitle_en: string;
  /** `null` until the Arabic text is added. */
  headTitle_ar: string | null;
  /** Max 255 characters each. */
  shortDescription_en: string;
  shortDescription_ar: string | null;
  description_en: string;
  description_ar: string | null;
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
  /** Max 100 characters each. English is required, Arabic optional. */
  headTitle_en: string;
  headTitle_ar?: string;
  /** Max 255 characters each. */
  shortDescription_en: string;
  shortDescription_ar?: string;
  description_en: string;
  description_ar?: string;
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

/** Optional fields: omitted from a create response when not sent, cleared with `null` on update. */
type OptionalUserInfoField =
  | "headTitle_ar"
  | "shortDescription_ar"
  | "description_ar"
  | "gmail"
  | "linkedin"
  | "github"
  | "cv";

type OptionalUserInfoFields = {
  [Field in OptionalUserInfoField]?: string | null;
};

/** The saved row; optional fields are omitted when not sent. */
export type CreateUserInfoResponse = Omit<UserInfo, OptionalUserInfoField> &
  OptionalUserInfoFields;

/** GET /user-info; `order` sorts by `createdAt` (default DESC). */
export type UserInfoQuery = PaginationQuery;

/** Every user's row, not only the signed-in user's. */
export type UserInfoResponse = PaginatedResponse<UserInfo>;

/** GET /user-info/me: 404 until the signed-in user creates their row. */
export type MyUserInfoResponse = UserInfoDetails;

/**
 * PATCH /user-info/:id: any subset of the create fields. `null` clears an
 * optional field, e.g. an Arabic text or a link (omitting it keeps the current one).
 */
export type UpdateUserInfoRequest = Partial<
  Omit<CreateUserInfoRequest, OptionalUserInfoField>
> &
  OptionalUserInfoFields;

export type UpdateUserInfoResponse = MessageResponse;

export type DeleteUserInfoResponse = MessageResponse;
