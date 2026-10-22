"use client";

import { useTranslations } from "next-intl";
import type { UserCompany } from "@repo/types/user-company";
import type { QueryState } from "../../utils";
import { CompanyBadge } from "./components";
import { useCompanyBadges } from "./hooks";

/**
 * "Trusted by" strip under the hero (GET /user-company/public). It is
 * decorative, so it renders nothing while loading, on error, or when empty.
 */
export function Companies({
  companies,
}: {
  companies: QueryState<UserCompany[]>;
}) {
  const t = useTranslations();
  const badges = useCompanyBadges(companies.data);
  if (!badges.length) return null;
  return (
    <section className="mx-auto w-full max-w-[1440px] px-4 pb-[54px] text-center text-[8px] tracking-[0.12em] text-muted-foreground">
      {t("companiesTitle")}
      <div className="mt-4 flex flex-wrap justify-center gap-x-10 gap-y-3 max-[700px]:justify-start">
        {badges.map((company) => (
          <CompanyBadge key={company.id} company={company} />
        ))}
      </div>
    </section>
  );
}
