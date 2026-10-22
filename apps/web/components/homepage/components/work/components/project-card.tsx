import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import type { Project } from "@repo/types/projects";
import { ArrowRight } from "@repo/ui/icons";
import { localize } from "../../../../../utils/localize";
import { getProjectEyebrow } from "../utils";

export function ProjectCard({
  project,
  reversed,
}: {
  project: Project;
  reversed: boolean;
}) {
  const t = useTranslations();
  const locale = useLocale();
  const name = localize(locale, project.nameEn, project.nameAr);
  return (
    <article className="mx-auto grid w-full max-w-[820px] grid-cols-2 items-center gap-[35px] max-[700px]:grid-cols-1 max-[700px]:gap-5">
      {project.mainImageUrl ? (
        <Image
          className="h-[230px] w-full rounded-[7px] object-cover max-[700px]:h-[200px]"
          src={project.mainImageUrl}
          alt={name}
          height={460}
          unoptimized
          width={820}
        />
      ) : (
        <div className="grid h-[230px] w-full place-items-center rounded-[7px] bg-muted text-xl font-extrabold text-muted-foreground max-[700px]:h-[200px]">
          {name}
        </div>
      )}
      <div className={reversed ? "min-[701px]:-order-1" : undefined}>
        <span className="text-[10px] tracking-[0.12em] text-primary font-extrabold">
          {getProjectEyebrow(project, locale)}
        </span>
        <h3 className="my-[7px] text-[19px]">{name}</h3>
        <p className="my-1 text-[11px] leading-[1.7] text-muted-foreground">
          {localize(locale, project.descriptionEn, project.descriptionAr)}
        </p>
        <div className="flex gap-4">
          {project.liveUrl && (
            <a
              className="flex items-center gap-[5px] text-[10px] text-primary no-underline"
              href={project.liveUrl}
              rel="noreferrer"
              target="_blank"
            >
              {t("workLiveSite")}{" "}
              <ArrowRight className="w-[13px] rtl:-scale-x-100" />
            </a>
          )}
          {project.repoUrl && (
            <a
              className="flex items-center gap-[5px] text-[10px] text-primary no-underline"
              href={project.repoUrl}
              rel="noreferrer"
              target="_blank"
            >
              {t("workSourceCode")}{" "}
              <ArrowRight className="w-[13px] rtl:-scale-x-100" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
