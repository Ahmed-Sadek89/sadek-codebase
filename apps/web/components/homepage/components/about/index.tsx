"use client";

import { useTranslations } from "next-intl";
import type { UserInfoDetails } from "@repo/types/user-info";
import type { QueryState } from "../../utils";
import { SectionTitle } from "../../../ui/section-title";
import { SectionStatus } from "../../../ui/section-status";
import { AboutStory, StatCard } from "./components";
import { useAboutContent } from "./hooks";

export function About({
  userInfo,
}: {
  userInfo: QueryState<UserInfoDetails | undefined>;
}) {
  const t = useTranslations();
  const { description, stats, cvUrl } = useAboutContent(userInfo.data);
  return (
    <section
      id="about"
      className="relative isolate overflow-hidden bg-muted py-[76px] max-[700px]:py-[54px]"
    >
      <div
        aria-hidden="true"
        className="absolute -start-32 top-1/3 -z-10 size-80 rounded-full bg-primary/10 blur-3xl"
      />
      <div className="app-container py-0">
        <SectionTitle title={t("aboutTitle")} copy={t("aboutCopy")} />
        {description ? (
          // Story beside the numbers on large screens, stacked below.
          <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_1fr] lg:gap-12">
            <AboutStory description={description} cvUrl={cvUrl} />
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {stats.map((stat) => (
                <StatCard key={stat.labelKey} stat={stat} />
              ))}
            </div>
          </div>
        ) : (
          <SectionStatus
            isLoading={userInfo.isLoading}
            isError={userInfo.isError}
            emptyText={t("aboutEmpty")}
          />
        )}
      </div>
    </section>
  );
}
