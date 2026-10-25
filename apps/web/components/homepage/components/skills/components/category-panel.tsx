import { useLocale, useTranslations } from "next-intl";
import { localize } from "../../../../../utils/localize";
import { categoryNumber, type SkillGroup } from "../utils";
import { SkillTile } from "./skill-tile";

/** Per-tile delay of the fade-in, capped so long lists don't lag. */
const STAGGER_MS = 30;
const STAGGER_MAX_MS = 360;

/** The selected category: number, name, skill count and description, then every skill as a tile. */
export function CategoryPanel({ group, index }: { group: SkillGroup; index: number }) {
  const t = useTranslations();
  const locale = useLocale();
  const { category, skills } = group;
  const name = localize(locale, category.nameEn, category.nameAr);
  const description = localize(locale, category.descriptionEn, category.descriptionAr);

  return (
    <div className="relative isolate overflow-hidden rounded-3xl border border-border bg-card/80 p-6 shadow-lg shadow-primary/5 backdrop-blur animate-in fade-in slide-in-from-bottom-2 motion-reduce:animate-none sm:p-8">
      <span
        aria-hidden="true"
        className="absolute -end-20 -top-20 -z-10 size-64 rounded-full bg-primary/15 blur-3xl"
      />
      <header className="flex flex-wrap items-start gap-x-5 gap-y-3 border-b border-border/70 pb-6">
        <span
          aria-hidden="true"
          className="bg-linear-to-br from-primary to-accent-strong bg-clip-text text-5xl leading-none font-black text-transparent tabular-nums"
        >
          {categoryNumber(index)}
        </span>
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <h3 className="text-xl font-bold text-foreground sm:text-2xl">{name}</h3>
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              {t("skillsCount", { count: skills.length })}
            </span>
          </div>
          {description && (
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
              {description}
            </p>
          )}
        </div>
      </header>
      <ul
        aria-label={name}
        className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4"
      >
        {skills.map((skill, position) => (
          <li key={skill.id}>
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
