import type {
  EmploymentType,
  LocationType,
} from "@repo/constants/user-company";
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
  company_name: string;
  description_en: string | null;
  description_ar: string | null;
  startWorkFrom: IsoDateString;
  /** `null` while still working there. */
  startWorkTo: IsoDateString | null;
  logo: string | null;
  company_site: string | null;
  /** Max 100 characters, e.g. "Senior Front-end Developer". */
  job_title: string;
  /** Max 100 characters, e.g. "Cairo, Egypt". */
  location: string;
  /** The values live in `@repo/constants/user-company`. */
  location_type: LocationType;
  employment_type: EmploymentType;
  /** Inactive companies are hidden from GET /user-company/public. */
  isActive: boolean;
  createdAt: IsoDateString;
}

/** An item of GET /user-company: includes the owner as `user: { id }`. */
export interface UserCompany extends UserCompanyDetails {
  user: { id: number };
}

/** POST /user-company */
export interface CreateUserCompanyRequest {
  /** Required, max 50 characters. */
  company_name: string;
  description_en?: string;
  description_ar?: string;
  /** ISO 8601 date or date-time. */
  startWorkFrom: IsoDateString;
  /** On or after `startWorkFrom`, or the request returns 400. Omit while still working there. */
  startWorkTo?: IsoDateString;
  /** http(s) URLs, max 255 characters each. */
  logo?: string;
  company_site?: string;
  /** Required, non-empty, max 100 characters. */
  job_title: string;
  /** Required, non-empty, max 100 characters. */
  location: string;
  /** Required: `remote`, `onsite` or `hybrid`. */
  location_type: LocationType;
  /** Required: `full-time`, `part-time`, `freelance` or `internship`. */
  employment_type: EmploymentType;
  /** Defaults to `true` when omitted. */
  isActive?: boolean;
}

/** Optional fields: omitted from a create response when not sent, cleared with `null` on update. */
type OptionalUserCompanyField =
  | "description_en"
  | "description_ar"
  | "startWorkTo"
  | "logo"
  | "company_site";

type OptionalUserCompanyFields = {
  [Field in OptionalUserCompanyField]?: string | null;
};

/** The saved row; optional fields are omitted when not sent. */
export type CreateUserCompanyResponse = Omit<
  UserCompany,
  OptionalUserCompanyField
> &
  OptionalUserCompanyFields;

/**
 * GET /user-company, GET /user-company/public and GET /user-company/me (`FilterUserCompanyDto`).
 * `order` sorts the two lists by `createdAt` and `/me` by `startWorkFrom`; all default to DESC.
 */
export interface UserCompaniesQuery extends PaginationQuery {
  /** Matches the company name or the English or Arabic description (case-insensitive). Max 20 characters. */
  search?: string;
  /** Filters by status (unset = all). Ignored by `/public`, which only returns active companies. */
  isActive?: boolean;
}

export type UserCompaniesResponse = PaginatedResponse<UserCompany>;

/** GET /user-company/me: the signed-in user's companies. */
export type MyUserCompaniesResponse = PaginatedResponse<UserCompanyDetails>;

/**
 * PATCH /user-company/:id: any subset of the create fields. `null` clears an
 * optional field, e.g. `startWorkTo: null` marks the job as current.
 */
export type UpdateUserCompanyRequest = Partial<
  Omit<CreateUserCompanyRequest, OptionalUserCompanyField>
> &
  OptionalUserCompanyFields;

export type UpdateUserCompanyResponse = MessageResponse;

/** PATCH /user-company/:id/toggle-active: the row's new `isActive`. */
export type ToggleUserCompanyActiveResponse = MessageResponse & {
  isActive: boolean;
};

export type DeleteUserCompanyResponse = MessageResponse;
