import { useTranslations } from "next-intl";
import type { Project } from "@repo/types/projects";
import { ArrowUpRight } from "@repo/ui/icons";
import { GithubIcon } from "../../../../ui/brand-icon";

const linkButton =
  "inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold no-underline transition duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

/** "Visit live site" and "View source code" buttons, or a note when the project has neither. */
export function ProjectLinks({ project }: { project: Project }) {
  const t = useTranslations();

  if (!project.liveUrl && !project.repoUrl) {
    return <p className="text-sm text-muted-foreground">{t("workNoLinks")}</p>;
  }
  return (
    <div className="flex flex-wrap gap-3">
      {project.liveUrl && (
        <a
          className={`${linkButton} bg-primary text-primary-foreground shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/30`}
          href={project.liveUrl}
          rel="noopener noreferrer"
          target="_blank"
        >
          {t("workVisit")}
          <ArrowUpRight aria-hidden="true" className="size-4 rtl:-scale-x-100" />
        </a>
      )}
      {project.repoUrl && (
        <a
          className={`${linkButton} border border-border bg-card text-foreground shadow-sm hover:border-primary/40`}
          href={project.repoUrl}
          rel="noopener noreferrer"
          target="_blank"
        >
          <GithubIcon className="size-4" />
          {t("workViewCode")}
        </a>
      )}
    </div>
  );
}
