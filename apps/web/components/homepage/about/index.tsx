"use client";

import { useTranslations } from "next-intl";
import { SectionTitle } from "../components/section-title";
import { SectionStatus } from "../components/section-status";
import { StatCard } from "./components";
import { useAboutContent } from "./hooks";

export function About() {
  const t = useTranslations();
  const { description, stats, isPending } = useAboutContent();
  return (
    <section
      id="about"
      className="mx-auto w-full max-w-[1440px] px-4 py-[76px] max-[700px]:py-[54px] bg-muted"
    >
      <SectionTitle title={t("aboutTitle")} copy={t("aboutCopy")} />
      {description ? (
        <>
          <p className="mx-auto mb-[26px] max-w-[750px] whitespace-pre-line text-center text-[11px] leading-[1.7] text-muted-foreground">
            {description}
          </p>
          <div className="grid grid-cols-4 gap-3 max-[700px]:grid-cols-2">
            {stats.map((stat) => (
              <StatCard key={stat.labelKey} stat={stat} />
            ))}
          </div>
        </>
      ) : (
        <SectionStatus isPending={isPending} emptyText={t("aboutEmpty")} />
      )}
    </section>
  );
}
