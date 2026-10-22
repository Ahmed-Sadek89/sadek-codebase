import type { UserCompany } from "@repo/types/user-company";
import { localize } from "../../../../../utils/localize";
import { hasText } from "../../../utils";

export type CompanyBadge = {
  id: number;
  name: string;
  logo?: string;
  site?: string;
};

/** A company as the strip shows it: its name in the page's language, logo and site. */
export function toCompanyBadge(
  company: UserCompany,
  locale: string,
): CompanyBadge {
  return {
    id: company.id,
    name: localize(locale, company.name_en, company.name_ar),
    logo: hasText(company.logo) ? company.logo : undefined,
    site: hasText(company.company_site) ? company.company_site : undefined,
  };
}
