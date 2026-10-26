import { useLocale, useTranslations } from "next-intl";
import { localize } from "../../../../../utils/localize";
import type { SkillGroup } from "../utils";
import { SkillTile } from "./skill-tile";

/** Per-pill delay of the fade-in, capped so long lists don't lag. */
const STAGGER_MS = 30;
const STAGGER_MAX_MS = 360;

/** The selected category: a slim header (name, count, description), then every skill as a pill. */
export function CategoryPanel({ group }: { group: SkillGroup }) {
  const t = useTranslations();
  const locale = useLocale();
  const { category, skills } = group;
  const name = localize(locale, category.nameEn, category.nameAr);
  const description = localize(locale, category.descriptionEn, category.descriptionAr);

  return (
    <div className="animate-in fade-in motion-reduce:animate-none">
      <header className="mb-4 space-y-1">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
          <h3 className="text-lg font-bold text-foreground">{name}</h3>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
            {t("skillsCount", { count: skills.length })}
          </span>
        </div>
        {description && (
          <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </header>
      <ul aria-label={name} className="flex flex-wrap gap-2">
        {skills.map((skill, position) => (
          <li className="min-w-0 max-w-full" key={skill.id}>
            <SkillTile
              delay={Math.min(position * STAGGER_MS, STAGGER_MAX_MS)}
              skill={skill}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
