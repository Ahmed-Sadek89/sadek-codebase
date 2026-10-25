import {
  EMPLOYMENT_TYPES,
  EmploymentType,
  LOCATION_TYPES,
  LocationType,
} from "@repo/constants/user-company";
import type {
  UserCompaniesQuery,
  UserCompanyDetails,
} from "@repo/types/user-company";
import type { MessageKey } from "../../../i18n/types";
import type { ListQueryParams } from "../../../utils/list-query";
import type { UserCompanyFormInput } from "../schema";

/** Page size when the URL has no `?limit=`. */
export const USER_COMPANIES_LIMIT = 10;

/**
 * The list query for the URL's `search`, `page`, `limit`, `order`, and
 * `isActive` (any combination). Shared by the server prefetch and the client
 * hook so both build the same query key.
 */
export function getUserCompaniesQuery(
  params: ListQueryParams,
): UserCompaniesQuery {
  return { limit: USER_COMPANIES_LIMIT, ...params };
}

/** Month and year of a work date, e.g. "Mar 2024". */
export const WORK_DATE_FORMAT = { month: "short", year: "numeric" } as const;

export const LINK_CLASS_NAME =
  "inline-flex size-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-primary/60 hover:text-primary";

/** Each location type's label; a `Record`, so a new type needs one. */
const LOCATION_TYPE_LABEL_KEYS: Record<LocationType, MessageKey> = {
  [LocationType.REMOTE]: "userCompanyLocationTypeRemote",
  [LocationType.ONSITE]: "userCompanyLocationTypeOnsite",
  [LocationType.HYBRID]: "userCompanyLocationTypeHybrid",
};

/** Each employment type's label; a `Record`, so a new type needs one. */
const EMPLOYMENT_TYPE_LABEL_KEYS: Record<EmploymentType, MessageKey> = {
  [EmploymentType.FULL_TIME]: "userCompanyEmploymentTypeFullTime",
  [EmploymentType.PART_TIME]: "userCompanyEmploymentTypePartTime",
  [EmploymentType.FREELANCE]: "userCompanyEmploymentTypeFreelance",
  [EmploymentType.INTERNSHIP]: "userCompanyEmploymentTypeInternship",
};

/** Options for the location-type select, in the shared order. */
export const LOCATION_TYPE_OPTIONS = LOCATION_TYPES.map((value) => ({
  value,
  labelKey: LOCATION_TYPE_LABEL_KEYS[value],
}));

/** Options for the employment-type select, in the shared order. */
export const EMPLOYMENT_TYPE_OPTIONS = EMPLOYMENT_TYPES.map((value) => ({
  value,
  labelKey: EMPLOYMENT_TYPE_LABEL_KEYS[value],
}));

export function locationTypeLabelKey(type: LocationType): MessageKey {
  return LOCATION_TYPE_LABEL_KEYS[type];
}

export function employmentTypeLabelKey(type: EmploymentType): MessageKey {
  return EMPLOYMENT_TYPE_LABEL_KEYS[type];
}

export const USER_COMPANY_FORM_DEFAULT_VALUES = {
  logo: "",
  company_name: "",
  description_en: "",
  description_ar: "",
  startWorkFrom: "",
  isCurrent: false,
  startWorkTo: "",
  company_site: "",
  job_title: "",
  location: "",
  location_type: "",
  employment_type: "",
  isActive: true,
} satisfies UserCompanyFormInput;

/** A saved ISO date as the month picker's "YYYY-MM" (UTC, like the table). */
const toMonthValue = (date: string | null) => (date ? date.slice(0, 7) : "");

/** Form values for a row being edited, or the blank defaults when creating. */
export function toUserCompanyFormInput(
  company?: UserCompanyDetails | null,
): UserCompanyFormInput {
  if (!company) return USER_COMPANY_FORM_DEFAULT_VALUES;
  return {
    logo: company.logo ?? "",
    company_name: company.company_name,
    description_en: company.description_en ?? "",
    description_ar: company.description_ar ?? "",
    startWorkFrom: toMonthValue(company.startWorkFrom),
    isCurrent: company.startWorkTo === null,
    startWorkTo: toMonthValue(company.startWorkTo),
    company_site: company.company_site ?? "",
    job_title: company.job_title,
    location: company.location,
    location_type: company.location_type,
    employment_type: company.employment_type,
    isActive: company.isActive,
  };
}
