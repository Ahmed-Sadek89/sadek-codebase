import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import type { Project } from "@repo/types/projects";
import { Layers } from "@repo/ui/icons";
import { cn } from "@repo/ui/utils";
import { isMediaUrl } from "../../../../../libs/media";
import { CollapsibleRichText } from "../../../../ui/collapsible-rich-text";
import { localize } from "../../../../../utils/localize";
import { getProjectCategories } from "../utils";
import { ProjectLinks } from "./project-links";

export function ProjectShowcase({
  project,
  index,
  reversed = false,
}: {
  project: Project;
  index: number;
  reversed?: boolean;
}) {
  const t = useTranslations();
  const locale = useLocale();
  const name = localize(locale, project.nameEn, project.nameAr);
  const summary = localize(locale, project.shortDescriptionEn, project.shortDescriptionAr);
  const descriptionHtml = localize(locale, project.descriptionEn, project.descriptionAr);
  const categories = getProjectCategories(project, locale);
  const number = String(index + 1).padStart(2, "0");
  const titleId = `project-${project.id}-title`;

  return (
    <article
      aria-labelledby={titleId}
      className="group grid items-start gap-8 animate-in fade-in slide-in-from-bottom-2 motion-reduce:animate-none lg:grid-cols-2 lg:gap-14"
    >
      <div
        className={cn(
          "relative lg:sticky lg:top-24",
          reversed && "lg:order-2",
        )}
      >
        {/* A tilted accent card behind the image. */}
        <span
          aria-hidden="true"
          className={cn(
            "absolute inset-0 -z-10 rounded-3xl bg-linear-135/srgb from-primary/25 to-accent-strong/25 transition-transform duration-500",
            reversed
              ? "-rotate-2 group-hover:-rotate-3"
              : "rotate-2 group-hover:rotate-3",
          )}
        />
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border bg-muted shadow-xl shadow-primary/10">
          {project.mainImageUrl ? (
            <Image
              alt={name}
              className="object-cover transition duration-700 group-hover:scale-105"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              src={project.mainImageUrl}
              unoptimized={!isMediaUrl(project.mainImageUrl)}
            />
          ) : (
            <span className="grid size-full place-items-center bg-linear-135/srgb from-primary/20 to-accent-strong/20 p-6 text-center text-3xl font-black text-primary/70">
              {name}
            </span>
          )}

        </div>
      </div>

      <div className="min-w-0 space-y-6">
        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span
              aria-hidden="true"
              className="bg-linear-to-r from-primary to-accent-strong bg-clip-text text-4xl font-black text-transparent tabular-nums"
            >
              {number}
            </span>
            {categories.length > 0 && (
              <ul aria-label={t("workCategories")} className="flex flex-wrap gap-1.5">
                {categories.map((category) => (
                  <li
                    className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary"
                    key={category.id}
                  >
                    {category.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <h3
            className="text-2xl leading-tight font-bold text-foreground sm:text-3xl"
            id={titleId}
          >
            {name}
          </h3>
          {summary && (
            <p className="border-s-4 border-primary/50 ps-4 text-base leading-relaxed font-medium text-muted-foreground sm:text-lg">
              {summary}
            </p>
          )}
        </header>

        <CollapsibleRichText
          className="text-[15px] leading-7"
          fadeClassName="from-background"
          html={descriptionHtml}
        />

        <dl className="grid grid-cols-1 gap-4 rounded-2xl border border-border bg-card/70 p-4 text-sm shadow-sm backdrop-blur">

          <div className="space-y-1">
            <dt className="flex items-center gap-1.5 text-xs font-semibold  text-muted-foreground uppercase">
              <Layers aria-hidden="true" className="size-3.5" />
              {t("workCategories")}
            </dt>
            <dd className="font-semibold text-foreground">
              {categories.length ? categories.map((category) => category.name).join(" · ") : "—"}
            </dd>
          </div>
        </dl>

        <ProjectLinks project={project} />
      </div>
    </article>
  );
}
