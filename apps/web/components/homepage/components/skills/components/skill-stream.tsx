import { useLocale, useTranslations } from "next-intl";
import { localize } from "../../../../../utils/localize";
import type { SkillGroup } from "../utils";
import { SkillChip } from "./skill-chip";
import { SkillTicker } from "./skill-ticker";

/**
 * One category as a row: its label (number, name, count, description) at
 * the start, its skills streaming past beside it, or below it on small screens.
 */
export function SkillStream({
  group,
  index,
}: {
  group: SkillGroup;
  index: number;
}) {
  const t = useTranslations();
  const locale = useLocale();
  const { category, skills } = group;
  const description = localize(
    locale,
    category.descriptionEn,
    category.descriptionAr,
  );
  return (
    <article className="group relative flex flex-col gap-4 overflow-hidden rounded-3xl border border-border bg-card/70 p-5 shadow-sm backdrop-blur transition duration-300 animate-in fade-in slide-in-from-bottom-2 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 motion-reduce:animate-none sm:p-6 lg:flex-row lg:items-center lg:gap-8">
      {/* Accent bar that lights up on hover. */}
      <span
        aria-hidden="true"
        className="absolute inset-y-0 start-0 w-1 bg-linear-to-b from-primary to-accent-strong opacity-40 transition-opacity duration-300 group-hover:opacity-100"
      />
      <header className="flex shrink-0 items-start gap-4 lg:w-72">
        <span className="bg-linear-to-br from-primary to-accent-strong bg-clip-text text-3xl leading-none font-black text-transparent tabular-nums sm:text-4xl">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="min-w-0">
          <h3 className="text-base font-bold text-foreground sm:text-lg">
            {localize(locale, category.nameEn, category.nameAr)}
          </h3>
          <p className="mt-0.5 text-[11px] font-semibold tracking-wider text-primary uppercase">
            {t("skillsCount", { count: skills.length })}
          </p>
          {description && (
            <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground sm:text-[13px]">
              {description}
            </p>
          )}
        </div>
      </header>
      <div className="min-w-0 flex-1">
        <SkillTicker reverse={index % 2 === 1} skills={skills} />
        {/* The readable list: screen readers always; on screen only for reduced motion. */}
        <ul className="sr-only motion-reduce:not-sr-only motion-reduce:flex motion-reduce:flex-wrap motion-reduce:gap-2.5">
          {skills.map((skill) => (
            <li key={skill.id}>
              <SkillChip skill={skill} />
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
