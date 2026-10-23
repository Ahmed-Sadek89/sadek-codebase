"use client";

import { useTranslations } from "next-intl";
import type { UserCompany } from "@repo/types/user-company";
import type { UserInfoDetails } from "@repo/types/user-info";
import { Button } from "@repo/ui/button";
import { CvIcon } from "../../../ui/brand-icon";
import { SectionTitle } from "../../../ui/section-title";
import { SectionStatus } from "../../../ui/section-status";
import { ShowMoreButton } from "../../../ui/show-more-button";
import type { InfiniteQueryState, QueryState } from "../../utils";
import { TimelineItem } from "./components";
import { useExperience } from "./hooks";

export function Experience({
  companies: companiesQuery,
  userInfo,
}: {
  /** GET /user-company/public, 5 companies per page, plus "show more". */
  companies: InfiniteQueryState<UserCompany>;
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
      aria-labelledby="experience-title"
      className="relative isolate overflow-hidden bg-surface py-[76px] max-[700px]:py-[54px]"
    >
      <div
        aria-hidden="true"
        className="absolute -end-32 top-1/3 -z-10 size-96 rounded-full bg-primary/10 blur-3xl"
      />
      <div className="app-container py-0">
        <SectionTitle
          id="experience-title"
          title={t("experienceTitle")}
          copy={t("experienceCopy")}
        />
        {companies.length ? (
          <ol className="relative mx-auto max-w-5xl">
            {/* The line: at the start on small screens, centred on large ones. */}
            <span
              aria-hidden="true"
              className="absolute top-2 bottom-2 start-[19px] w-0.5 bg-linear-to-b from-primary via-border-strong to-transparent sm:start-[27px] lg:start-auto lg:left-1/2 lg:-translate-x-1/2"
            />
            {companies.map((company, index) => (
              <TimelineItem
                company={company}
                flip={index % 2 === 1}
                key={company.id}
              />
            ))}
          </ol>
        ) : (
          <SectionStatus
            isLoading={companiesQuery.isLoading}
            isError={companiesQuery.isError}
            emptyText={t("experienceEmpty")}
          />
        )}
        {companies.length > 0 && companiesQuery.hasMore && (
          <ShowMoreButton
            isLoading={companiesQuery.isLoadingMore}
            onClick={companiesQuery.loadMore}
          />
        )}
        {cvUrl && (
          <div className="mt-10 flex justify-center">
            <Button
              asChild
              className="h-11 rounded-full px-6 shadow-md shadow-primary/25"
            >
              <a href={cvUrl} rel="noreferrer" target="_blank">
                <CvIcon className="size-4" />
                {t("aboutDownloadCv")}
              </a>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
