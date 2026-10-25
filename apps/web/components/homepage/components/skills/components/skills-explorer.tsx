"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { LoaderCircle, Plus } from "@repo/ui/icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/tabs";
import { cn } from "@repo/ui/utils";
import { localize } from "../../../../../utils/localize";
import { useMediaQuery } from "../hooks";
import { categoryNumber, type SkillGroup } from "../utils";
import { CategoryPanel } from "./category-panel";

/**
 * Categories as tabs beside the selected category's panel: a vertical,
 * sticky list on large screens, a horizontally scrolling row on smaller ones.
 * The last tab-row item loads more categories while there are any.
 */
export function SkillsExplorer({
  groups,
  hasMore,
  isLoadingMore,
  onLoadMore,
}: {
  groups: SkillGroup[];
  hasMore: boolean;
  isLoadingMore: boolean;
  onLoadMore: () => void;
}) {
  const t = useTranslations();
  const locale = useLocale();
  const isWide = useMediaQuery("(min-width: 1024px)");
  const [selected, setSelected] = useState<string | undefined>();
  // Fall back to the first category until one is picked (or if it disappears).
  const value = groups.some((group) => String(group.category.id) === selected)
    ? selected
    : String(groups[0]?.category.id);

  return (
    <Tabs
      className="grid gap-6 lg:grid-cols-[17rem_minmax(0,1fr)] lg:items-start lg:gap-8"
      onValueChange={setSelected}
      orientation={isWide ? "vertical" : "horizontal"}
      value={value}
    >
      <div className="min-w-0 lg:sticky lg:top-24">
        <TabsList
          aria-label={t("skillsCategoriesLabel")}
          className="flex h-auto w-full snap-x justify-start gap-2 overflow-x-auto rounded-none bg-transparent p-1 [scrollbar-width:none] lg:flex-col lg:items-stretch lg:overflow-visible"
        >
          {groups.map((group, index) => (
            <TabsTrigger
              className={cn(
                "group/tab h-auto shrink-0 snap-start justify-start gap-3 rounded-2xl border border-border bg-card/70 px-3 py-2.5 text-start whitespace-nowrap shadow-xs backdrop-blur transition duration-200 hover:border-primary/40 lg:w-full lg:whitespace-normal",
                "data-[state=active]:border-primary/50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md data-[state=active]:shadow-primary/25",
              )}
              key={group.category.id}
              value={String(group.category.id)}
            >
              <span
                aria-hidden="true"
                className="grid size-8 shrink-0 place-items-center rounded-xl bg-primary/10 text-xs font-black text-primary tabular-nums group-data-[state=active]/tab:bg-primary-foreground/20 group-data-[state=active]/tab:text-primary-foreground"
              >
                {categoryNumber(index)}
              </span>
              <span className="min-w-0 flex-1 text-sm font-semibold">
                {localize(locale, group.category.nameEn, group.category.nameAr)}
              </span>
              <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-bold text-muted-foreground tabular-nums group-data-[state=active]/tab:bg-primary-foreground/20 group-data-[state=active]/tab:text-primary-foreground">
                {group.skills.length}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
        {hasMore && (
          <button
            aria-busy={isLoadingMore}
            className="mt-2 inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-2xl border border-dashed border-primary/50 bg-primary/5 px-4 text-sm font-semibold text-primary transition hover:bg-primary/10 disabled:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            disabled={isLoadingMore}
            onClick={onLoadMore}
            type="button"
          >
            {isLoadingMore ? (
              <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
            ) : (
              <Plus aria-hidden="true" className="size-4" />
            )}
            {isLoadingMore ? t("statusLoading") : t("skillsMoreCategories")}
          </button>
        )}
      </div>
      {groups.map((group, index) => (
        <TabsContent className="min-w-0" key={group.category.id} value={String(group.category.id)}>
          <CategoryPanel group={group} index={index} />
        </TabsContent>
      ))}
    </Tabs>
  );
}
