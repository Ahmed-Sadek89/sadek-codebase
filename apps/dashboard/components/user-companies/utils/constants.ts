import type {
  UserCompaniesQuery,
  UserCompanyDetails,
} from "@repo/types/user-company";
import type { ListQueryParams } from "../../../utils/list-query";
import type { UserCompanyFormInput } from "../schema";

/** Page size when the URL has no `?limit=`. */
export const USER_COMPANIES_LIMIT = 10;

/**
 * The list query for the URL's `search`, `page`, `limit`, and `order` (any
 * combination). Shared by the server prefetch and the client hook so both
 * build the same query key. `isActive` is dropped because
 * GET /user-company/me rejects it.
 */
export function getUserCompaniesQuery({
  isActive: _isActive,
  ...params
}: ListQueryParams): UserCompaniesQuery {
  return { limit: USER_COMPANIES_LIMIT, ...params };
}

/** Month and year of a work date, e.g. "Mar 2024". */
export const WORK_DATE_FORMAT = { month: "short", year: "numeric" } as const;

export const LINK_CLASS_NAME =
  "inline-flex size-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-primary/60 hover:text-primary";

export const USER_COMPANY_FORM_DEFAULT_VALUES = {
  logo: "",
  company_name: "",
  description_en: "",
  description_ar: "",
  startWorkFrom: "",
  isCurrent: false,
  startWorkTo: "",
  company_site: "",
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
  };
}
