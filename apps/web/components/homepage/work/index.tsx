import Link from "next/link";
import { ArrowRight } from "@repo/ui/icons";
import { SectionTitle } from "../components/section-title";

export function Work() {
  const projects = [
    [
      "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=900&q=80",
      "Lumen Analytics",
      "A cleaner way to read product metrics. We rebuilt the information architecture and shipped a focused dashboard that cut time-to-insight in half.",
    ],
    [
      "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=900&q=80",
      "Pace Fitness",
      "An iOS coaching app designed around real progress and motivation. Daily active users doubled within three months of launch.",
    ],
    [
      "https://images.unsplash.com/photo-1584305574647-0cc949a2bb9f?auto=format&fit=crop&w=900&q=80",
      "Marrow Coffee",
      "Full identity system for a specialty roaster — logo, packaging, and a warm digital experience for their online storefront.",
    ],
  ];
  return (
    <section
      id="work"
      className="mx-auto w-full max-w-[1440px] px-4 py-[76px] max-[700px]:py-[54px] bg-background"
    >
      <SectionTitle
        title="Selected Work"
        copy="A closer look at a few projects and the impact they made"
      />
      <div className="flex flex-col gap-[27px]">
        {projects.map(([image, title, copy], i) => (
          <article
            className="mx-auto grid max-w-[820px] grid-cols-2 items-center gap-[35px] max-[700px]:grid-cols-1 max-[700px]:gap-5"
            key={title}
          >
            <img
              className="h-[230px] w-full rounded-[7px] object-cover max-[700px]:h-[200px]"
              src={image}
              alt=""
            />
            <div className={i % 2 ? "min-[701px]:-order-1" : undefined}>
              <span className="text-[10px] tracking-[0.12em] text-primary font-extrabold">
                BRANDING · 2024
              </span>
              <h3 className="my-[7px] text-[19px]">{title}</h3>
              <p className="my-1 text-[11px] leading-[1.7] text-muted-foreground">
                {copy}
              </p>
              <Link
                className="flex items-center gap-[5px] text-[10px] text-primary no-underline"
                href="#contact"
              >
                View case study <ArrowRight className="w-[13px]" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
