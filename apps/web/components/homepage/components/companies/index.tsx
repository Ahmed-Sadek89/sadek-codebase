"use client";

import { useTranslations } from "next-intl";
import type { UserCompany } from "@repo/types/user-company";
import type { QueryState } from "../../utils";
import { CompaniesCarousel } from "./components";

/**
 * "Companies I've worked with" strip under the hero
 * (GET /user-company/public), as a slow endless carousel. It is decorative,
 * so it renders nothing while loading, on error, or when empty.
 */
export function Companies({
  companies,
}: {
  companies: QueryState<UserCompany[]>;
}) {
  const t = useTranslations();
  if (!companies.data.length) return null;
  return (
    <section className="w-full border-y border-border/60 bg-surface/40 py-10 sm:py-14">
      <div className="app-container mb-6 flex items-center gap-4 py-0 sm:mb-8">
        <span
          aria-hidden="true"
          className="h-px flex-1 bg-linear-to-r from-transparent to-border"
        />
        <h2 className="text-center text-[10px] font-semibold tracking-[0.2em] text-muted-foreground uppercase sm:text-xs">
          {t("companiesTitle")}
        </h2>
        <span
          aria-hidden="true"
          className="h-px flex-1 bg-linear-to-l from-transparent to-border"
        />
      </div>
      <CompaniesCarousel companies={companies.data} />
    </section>
  );
}
