import type { MessageResponse } from "./auth";
import type {
  IsoDateString,
  PaginatedResponse,
  PaginationQuery,
} from "./common";

/** GET /user-company/:id and the items of GET /user-company/me (no owner). */
export interface UserCompanyDetails {
  id: number;
  /** Max 50 characters. */
  name: string;
  description: string | null;
  startWorkFrom: IsoDateString;
  /** `null` while still working there. */
  startWorkTo: IsoDateString | null;
  logo: string | null;
  company_site: string | null;
  createdAt: IsoDateString;
}

/** An item of GET /user-company: includes the owner as `user: { id }`. */
export interface UserCompany extends UserCompanyDetails {
  user: { id: number };
}

/** POST /user-company */
export interface CreateUserCompanyRequest {
  /** Max 50 characters. */
  name: string;
  description?: string;
  /** ISO 8601 date or date-time. */
  startWorkFrom: IsoDateString;
  /** On or after `startWorkFrom`, or the request returns 400. Omit while still working there. */
  startWorkTo?: IsoDateString;
  /** http(s) URLs, max 255 characters each. */
  logo?: string;
  company_site?: string;
}

/** The saved row; optional fields are omitted when not sent. */
export type CreateUserCompanyResponse = Omit<
  UserCompany,
  "description" | "startWorkTo" | "logo" | "company_site"
> & {
  description?: string | null;
  startWorkTo?: IsoDateString | null;
  logo?: string | null;
  company_site?: string | null;
};

/**
 * GET /user-company and GET /user-company/me (`FilterUserCompanyDto`). `order` sorts the
 * list by `createdAt` and `/me` by `startWorkFrom`; both default to DESC.
 */
export interface UserCompaniesQuery extends PaginationQuery {
  /** Matches name or description (case-insensitive). Max 20 characters. */
  search?: string;
}

export type UserCompaniesResponse = PaginatedResponse<UserCompany>;

/** GET /user-company/me: the signed-in user's companies. */
export type MyUserCompaniesResponse = PaginatedResponse<UserCompanyDetails>;

/**
 * PATCH /user-company/:id: any subset of the create fields. `null` clears an
 * optional field, e.g. `startWorkTo: null` marks the job as current.
 */
export type UpdateUserCompanyRequest = Partial<
  Omit<
    CreateUserCompanyRequest,
    "description" | "startWorkTo" | "logo" | "company_site"
  >
> & {
  description?: string | null;
  startWorkTo?: IsoDateString | null;
  logo?: string | null;
  company_site?: string | null;
};

export type UpdateUserCompanyResponse = MessageResponse;

export type DeleteUserCompanyResponse = MessageResponse;
