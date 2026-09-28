import { Button } from "@repo/ui/button";
import { SectionTitle } from "../components/section-title";

export function Experience() {
  const items = [
    [
      "2022 — Present",
      "Senior Product Designer",
      "Luminex Labs",
      "Lead designer on the analytics platform, owning everything from research to shipped UI and the design system that supports it.",
    ],
    [
      "2020 — 2022",
      "Product Designer & Front-End",
      "Northwind Studio",
      "Designed and built marketing sites and web apps for early-stage startups, bridging strategy and engineering on small teams.",
    ],
    [
      "2018 — 2020",
      "UI Designer",
      "Mosaic Agency",
      "Crafted interfaces and brand systems for agency clients across fintech, health, and consumer products.",
    ],
  ];
  return (
    <section
      id="experience"
      className="mx-auto w-full max-w-[1440px] px-4 py-[76px] max-[700px]:py-[54px] bg-surface"
    >
      <SectionTitle
        title="Experience"
        copy="The roles and milestones that shaped how I work today"
      />
      <div className="relative mx-auto grid max-w-[850px] grid-cols-3 gap-[30px] before:absolute before:top-[7px] before:right-0 before:left-0 before:border-t before:border-border before:content-[''] max-[700px]:grid-cols-1 max-[700px]:gap-[5px] max-[700px]:before:top-0 max-[700px]:before:right-auto max-[700px]:before:bottom-0 max-[700px]:before:left-1 max-[700px]:before:border-t-0 max-[700px]:before:border-l">
        {items.map(([date, role, company, copy]) => (
          <article
            className="relative pt-6 before:absolute before:top-[3px] before:size-2 before:rounded-full before:bg-primary before:content-[''] max-[700px]:pt-0 max-[700px]:pb-[18px] max-[700px]:pl-[22px] max-[700px]:before:left-0"
            key={role}
          >
            <span className="text-[9px] text-primary">{date}</span>
            <h3 className="mt-2 mb-0.5 text-[13px]">{role}</h3>
            <b className="text-[10px] text-secondary-foreground">{company}</b>
            <p className="text-[10px] leading-[1.65] text-muted-foreground">
              {copy}
            </p>
          </article>
        ))}
      </div>
      <Button variant="outline" className="mx-auto mt-[30px] flex text-[10px]">
        ↓ Download Full Resume
      </Button>
    </section>
  );
}
