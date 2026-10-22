"use client";

import { Button } from "@repo/ui/button";
import { SectionTitle } from "../components/section-title";
import { SectionStatus } from "../components/section-status";
import { ExperienceItem } from "./components";
import { useExperience } from "./hooks";

export function Experience() {
  const { companies, cvUrl, isPending } = useExperience();
  return (
    <section
      id="experience"
      className="mx-auto w-full max-w-[1440px] px-4 py-[76px] max-[700px]:py-[54px] bg-surface"
    >
      <SectionTitle
        title="Experience"
        copy="The roles and milestones that shaped how I work today"
      />
      {companies.length ? (
        <div className="relative mx-auto grid max-w-[850px] grid-cols-3 gap-[30px] before:absolute before:top-[7px] before:right-0 before:left-0 before:border-t before:border-border before:content-[''] max-[700px]:grid-cols-1 max-[700px]:gap-[5px] max-[700px]:before:top-0 max-[700px]:before:right-auto max-[700px]:before:bottom-0 max-[700px]:before:left-1 max-[700px]:before:border-t-0 max-[700px]:before:border-l">
          {companies.map((company) => (
            <ExperienceItem key={company.id} company={company} />
          ))}
        </div>
      ) : (
        <SectionStatus isPending={isPending} emptyText="No experience yet." />
      )}
      {cvUrl && (
        <Button
          asChild
          variant="outline"
          className="mx-auto mt-[30px] flex w-fit text-[10px]"
        >
          <a href={cvUrl} rel="noreferrer" target="_blank">
            ↓ Download Full Resume
          </a>
        </Button>
      )}
    </section>
  );
}
