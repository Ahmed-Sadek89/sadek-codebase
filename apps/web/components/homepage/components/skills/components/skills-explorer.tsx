"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { LoaderCircle, Plus } from "@repo/ui/icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/tabs";
import { cn } from "@repo/ui/utils";
import { localize } from "../../../../../utils/localize";
import { categoryNumber, type SkillGroup } from "../utils";
import { CategoryPanel } from "./category-panel";

/**
 * One compact card: the categories as a row of tab chips across the top
 * (scrolling sideways on small screens, wrapping from lg), then the selected
 * category's skills. The trailing button loads more categories while there are any.
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
  const [selected, setSelected] = useState<string | undefined>();
  // Fall back to the first category until one is picked (or if it disappears).
  const value = groups.some((group) => String(group.category.id) === selected)
    ? selected
    : String(groups[0]?.category.id);

  return (
    <Tabs
      className="relative isolate mx-auto max-w-5xl gap-0 overflow-hidden rounded-3xl border border-border bg-card/80 shadow-lg shadow-primary/5 backdrop-blur"
      onValueChange={setSelected}
      value={value}
    >
      <span
        aria-hidden="true"
        className="absolute -end-20 -top-20 -z-10 size-56 rounded-full bg-primary/15 blur-3xl"
      />
      <div className="flex items-center gap-2 border-b border-border/70 p-2.5 sm:p-3">
        <TabsList
          aria-label={t("skillsCategoriesLabel")}
          className="flex h-auto w-auto min-w-0 flex-1 snap-x justify-start gap-1.5 overflow-x-auto rounded-none bg-transparent p-0.5 [scrollbar-width:none] lg:flex-wrap lg:overflow-visible"
        >
          {groups.map((group, index) => (
            <TabsTrigger
              className={cn(
                "group/tab h-9 flex-none shrink-0 snap-start gap-2 rounded-full border border-border bg-background/70 ps-1.5 pe-3 text-sm font-semibold whitespace-nowrap transition duration-200 hover:border-primary/40",
                "data-[state=active]:border-primary/50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md data-[state=active]:shadow-primary/25",
              )}
              key={group.category.id}
              value={String(group.category.id)}
            >
              <span
                aria-hidden="true"
                className="grid size-6 place-items-center rounded-full bg-primary/10 text-[10px] font-black text-primary tabular-nums group-data-[state=active]/tab:bg-primary-foreground/20 group-data-[state=active]/tab:text-primary-foreground"
              >
                {categoryNumber(index)}
              </span>
              {localize(locale, group.category.nameEn, group.category.nameAr)}
              <span className="text-xs font-bold text-muted-foreground tabular-nums group-data-[state=active]/tab:text-primary-foreground/80">
                {group.skills.length}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
        {hasMore && (
          <button
            aria-busy={isLoadingMore}
            aria-label={t("skillsMoreCategories")}
            className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-full border border-dashed border-primary/50 bg-primary/5 px-2.5 text-sm font-semibold text-primary transition hover:bg-primary/10 disabled:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:px-3.5"
            disabled={isLoadingMore}
            onClick={onLoadMore}
            title={t("skillsMoreCategories")}
            type="button"
          >
            {isLoadingMore ? (
              <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
            ) : (
              <Plus aria-hidden="true" className="size-4" />
            )}
            {/* Icon only on phones, where the chip row needs the width. */}
            <span className="hidden sm:inline">
              {isLoadingMore ? t("statusLoading") : t("skillsMoreCategories")}
            </span>
          </button>
        )}
      </div>
      {groups.map((group) => (
        <TabsContent
          className="min-w-0 p-4 sm:p-6"
          key={group.category.id}
          value={String(group.category.id)}
        >
          <CategoryPanel group={group} />
        </TabsContent>
      ))}
    </Tabs>
  );
}
