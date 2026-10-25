import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import type { Project } from "@repo/types/projects";
import { ArrowUpRight, CalendarDays, ExternalLink, Star } from "@repo/ui/icons";
import { cn } from "@repo/ui/utils";
import { GithubIcon } from "../../../../ui/brand-icon";
import { isMediaUrl } from "../../../../../libs/media";
import { localize } from "../../../../../utils/localize";
import { formatProjectDate, getProjectCategories } from "../utils";

const iconLink =
  "grid size-10 place-items-center rounded-full bg-background/90 text-foreground shadow-lg backdrop-blur transition hover:scale-110 hover:bg-primary hover:text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

/**
 * A portfolio card: a large image (zooms on hover, with quick links over it),
 * then categories, title, short description and the live / source links.
 * `featured` is the gallery's lead card: 2×2 on large screens, full width on
 * tablets, with a badge, a bigger title and the full description.
 * Other cards show the short description (or the full one on rows saved
 * before short descriptions existed).
 */
export function ProjectCard({
  project,
  featured = false,
}: {
  project: Project;
  featured?: boolean;
}) {
  const t = useTranslations();
  const locale = useLocale();
  const name = localize(locale, project.nameEn, project.nameAr);
  const categories = getProjectCategories(project, locale);
  const description =
    (!featured &&
      localize(locale, project.shortDescriptionEn, project.shortDescriptionAr)) ||
    localize(locale, project.descriptionEn, project.descriptionAr);
  return (
    <article
      className={cn(
        "group flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition duration-300 animate-in fade-in slide-in-from-bottom-2 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/15 motion-reduce:animate-none",
        featured && "sm:col-span-2 lg:row-span-2",
      )}
    >
      <div
        className={cn(
          "relative aspect-[4/3] overflow-hidden bg-muted",
          // The lead image grows to fill the 2-row card on large screens.
          featured && "sm:aspect-[16/9] lg:aspect-auto lg:min-h-80 lg:flex-1",
        )}
      >
        {project.mainImageUrl ? (
          <Image
            alt={name}
            className="object-cover transition duration-700 group-hover:scale-110"
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            src={project.mainImageUrl}
            unoptimized={!isMediaUrl(project.mainImageUrl)}
          />
        ) : (
          <span className="grid size-full place-items-center bg-linear-135/srgb from-primary/20 to-accent-strong/20 p-6 text-center text-2xl font-black text-primary/70">
            {name}
          </span>
        )}
        {/* Darkens on hover so the quick links stand out. */}
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-100"
        />
        <span className="absolute start-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-background/85 px-3 py-1 text-xs font-semibold text-foreground shadow-sm backdrop-blur">
          <CalendarDays aria-hidden="true" className="size-3.5 text-primary" />
          {formatProjectDate(project, locale)}
        </span>
        {featured && (
          <span className="absolute end-3 top-3 inline-flex items-center gap-1 rounded-full bg-linear-to-r from-primary to-accent-strong px-3 py-1 text-xs font-bold text-primary-foreground shadow-md shadow-primary/30">
            <Star aria-hidden="true" className="size-3.5 fill-current" />
            {t("workFeatured")}
          </span>
        )}
        {(project.liveUrl || project.repoUrl) && (
          // Always shown on touch screens; slide in on hover/focus where hover exists.
          <div className="absolute end-3 bottom-3 flex gap-2 transition duration-300 [@media(hover:hover)]:translate-y-2 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-focus-within:translate-y-0 [@media(hover:hover)]:group-focus-within:opacity-100 [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-hover:opacity-100">
            {project.repoUrl && (
              <a
                aria-label={t("workSourceCode")}
                className={iconLink}
                href={project.repoUrl}
                rel="noreferrer"
                target="_blank"
                title={t("workSourceCode")}
              >
                <GithubIcon className="size-[18px]" />
              </a>
            )}
            {project.liveUrl && (
              <a
                aria-label={t("workLiveSite")}
                className={iconLink}
                href={project.liveUrl}
                rel="noreferrer"
                target="_blank"
                title={t("workLiveSite")}
              >
                <ExternalLink aria-hidden="true" className="size-[18px]" />
              </a>
            )}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {categories.map((category) => (
              <span
                className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary"
                key={category.id}
              >
                {category.name}
              </span>
            ))}
          </div>
        )}
        <h3
          className={cn(
            "mt-3 leading-snug font-bold text-foreground transition-colors group-hover:text-primary",
            featured ? "text-xl sm:text-2xl lg:text-3xl" : "text-lg sm:text-xl",
          )}
        >
          {name}
        </h3>
        <p
          className={cn(
            "mt-2 text-sm leading-relaxed text-muted-foreground",
            featured ? "line-clamp-3 sm:text-[15px]" : "line-clamp-2",
          )}
        >
          {description}
        </p>
        {(project.liveUrl || project.repoUrl) && (
          <div className="mt-auto flex items-center justify-between gap-3 border-t border-border/70 pt-4 [&:not(:first-child)]:mt-5">
            {project.liveUrl ? (
              <a
                className="inline-flex items-center gap-1 text-sm font-semibold text-primary no-underline hover:underline"
                href={project.liveUrl}
                rel="noreferrer"
                target="_blank"
              >
                {t("workLiveSite")}
                <ArrowUpRight
                  aria-hidden="true"
                  className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:-scale-x-100"
                />
              </a>
            ) : (
              <span />
            )}
            {project.repoUrl && (
              <a
                className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground no-underline hover:text-foreground"
                href={project.repoUrl}
                rel="noreferrer"
                target="_blank"
              >
                <GithubIcon className="size-4" />
                {t("workSourceCode")}
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
