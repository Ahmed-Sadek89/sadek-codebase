"use client";

import { useId } from "react";
import { useLocale, useTranslations } from "next-intl";
import { localize } from "../../../../../utils/localize";
import { useVisibleSkills } from "../hooks";
import type { SkillGroup } from "../utils";
import { SkillChip } from "./skill-chip";

/**
 * One category as a card: number, name, skill count and description on top,
 * its skills as wrapping chips below. Long lists start collapsed.
 */
export function SkillCategoryCard({
  group,
  index,
}: {
  group: SkillGroup;
  index: number;
}) {
  const t = useTranslations();
  const locale = useLocale();
  const listId = useId();
  const { category, skills } = group;
  const { visible, hiddenCount, isExpanded, canToggle, toggle } =
    useVisibleSkills(skills);
  const name = localize(locale, category.nameEn, category.nameAr);
  const description = localize(
    locale,
    category.descriptionEn,
    category.descriptionAr,
  );

  return (
    <article className="group relative flex flex-col gap-5 overflow-hidden rounded-3xl border border-border bg-card/70 p-5 shadow-sm backdrop-blur transition duration-300 animate-in fade-in slide-in-from-bottom-2 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 motion-reduce:animate-none motion-reduce:hover:translate-y-0 sm:p-6">
      {/* Accent line that lights up on hover. */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-primary to-accent-strong opacity-40 transition-opacity duration-300 group-hover:opacity-100"
      />
      <header className="flex items-start gap-4">
        <span
          aria-hidden="true"
          className="grid size-12 shrink-0 place-items-center rounded-2xl border border-primary/20 bg-linear-to-br from-primary/15 to-accent-strong/15 text-lg font-black text-primary tabular-nums"
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
            <h3 className="text-base font-bold text-foreground sm:text-lg">
              {name}
            </h3>
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold tracking-wider text-primary uppercase">
              {t("skillsCount", { count: skills.length })}
            </span>
          </div>
          {description && (
            <p className="mt-1.5 line-clamp-3 text-xs leading-relaxed text-muted-foreground sm:text-[13px]">
              {description}
            </p>
          )}
        </div>
      </header>

      <ul
        id={listId}
        aria-label={name}
        className="flex flex-wrap gap-2 border-t border-border/70 pt-5"
      >
        {visible.map((skill) => (
          <li key={skill.id}>
            <SkillChip skill={skill} />
          </li>
        ))}
        {canToggle && (
          <li>
            <button
              type="button"
              aria-expanded={isExpanded}
              aria-controls={listId}
              onClick={toggle}
              className="inline-flex items-center rounded-full border border-dashed border-primary/50 px-3.5 py-1.5 text-[13px] font-semibold text-primary transition-colors duration-200 hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:text-sm"
            >
              {isExpanded
                ? t("skillsShowLess")
                : t("skillsShowAll", { count: hiddenCount })}
            </button>
          </li>
        )}
      </ul>
    </article>
  );
}
