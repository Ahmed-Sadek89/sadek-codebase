/**
 * Work arrangement and contract type of a user-company row, shared by the
 * backend (entity enums, DTO validation), the dashboard (form selects, table)
 * and the web app (experience timeline). Const objects, not TS `enum`s, so
 * Node can load this file as is.
 */
export const LocationType = {
  REMOTE: "remote",
  ONSITE: "onsite",
  HYBRID: "hybrid",
} as const;

// Same name as the object on purpose: one import gives the values and the type, like an enum.
// eslint-disable-next-line no-redeclare
export type LocationType = (typeof LocationType)[keyof typeof LocationType];

/** Every location type, in declaration order. */
export const LOCATION_TYPES = Object.values(LocationType) as [
  LocationType,
  ...LocationType[],
];

export const EmploymentType = {
  FULL_TIME: "full-time",
  PART_TIME: "part-time",
  FREELANCE: "freelance",
  INTERNSHIP: "internship",
} as const;

// eslint-disable-next-line no-redeclare
export type EmploymentType = (typeof EmploymentType)[keyof typeof EmploymentType];

/** Every employment type, in declaration order. */
export const EMPLOYMENT_TYPES = Object.values(EmploymentType) as [
  EmploymentType,
  ...EmploymentType[],
];

/** Max length of a company's `job_title` (e.g. "Senior Front-end Developer"). */
export const USER_COMPANY_JOB_TITLE_MAX = 100;

/** Max length of a company's `location` (e.g. "Cairo, Egypt"). */
export const USER_COMPANY_LOCATION_MAX = 100;

/**
 * Column defaults, so adding the required columns to a table that already has
 * rows succeeds. New rows always send their own values (the DTO requires them).
 */
export const DEFAULT_LOCATION_TYPE: LocationType = LocationType.ONSITE;
export const DEFAULT_EMPLOYMENT_TYPE: EmploymentType = EmploymentType.FULL_TIME;
