"use client";

import { useTranslations } from "next-intl";
import type { UserCompany } from "@repo/types/user-company";
import type { UserInfoDetails } from "@repo/types/user-info";
import { Button } from "@repo/ui/button";
import { SectionTitle } from "../section-title";
import { SectionStatus } from "../section-status";
import type { QueryState } from "../../utils";
import { ExperienceItem } from "./components";
import { useExperience } from "./hooks";

export function Experience({
  companies: companiesQuery,
  userInfo,
}: {
  companies: QueryState<UserCompany[]>;
  userInfo: QueryState<UserInfoDetails | undefined>;
}) {
  const t = useTranslations();
  const { companies, cvUrl } = useExperience(
    companiesQuery.data,
    userInfo.data,
  );
  return (
    <section
      id="experience"
      className="mx-auto w-full max-w-[1440px] px-4 py-[76px] max-[700px]:py-[54px] bg-surface"
    >
      <SectionTitle title={t("experienceTitle")} copy={t("experienceCopy")} />
      {companies.length ? (
        <div className="relative mx-auto grid max-w-[850px] grid-cols-3 gap-[30px] before:absolute before:top-[7px] before:right-0 before:left-0 before:border-t before:border-border before:content-[''] max-[700px]:grid-cols-1 max-[700px]:gap-[5px] max-[700px]:before:top-0 max-[700px]:before:end-auto max-[700px]:before:bottom-0 max-[700px]:before:start-1 max-[700px]:before:border-t-0 max-[700px]:before:border-s">
          {companies.map((company) => (
            <ExperienceItem key={company.id} company={company} />
          ))}
        </div>
      ) : (
        <SectionStatus
          isLoading={companiesQuery.isLoading}
          isError={companiesQuery.isError}
          emptyText={t("experienceEmpty")}
        />
      )}
      {cvUrl && (
        <Button
          asChild
          variant="outline"
          className="mx-auto mt-[30px] flex w-fit text-[10px]"
        >
          <a href={cvUrl} rel="noreferrer" target="_blank">
            {t("experienceDownloadCv")}
          </a>
        </Button>
      )}
    </section>
  );
}
