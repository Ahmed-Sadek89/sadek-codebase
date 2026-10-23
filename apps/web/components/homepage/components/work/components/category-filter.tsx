import { useLocale, useTranslations } from "next-intl";
import type { CategoryProject } from "@repo/types/category-projects";
import { LoaderCircle, Plus } from "@repo/ui/icons";
import { cn } from "@repo/ui/utils";
import { localize } from "../../../../../utils/localize";

const chipClass =
  "inline-flex h-9 items-center gap-1.5 rounded-full px-4 text-[13px] font-medium whitespace-nowrap transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

/**
 * "All" plus one chip per loaded category; a dashed "More categories" chip
 * loads the next page of categories until there are none left.
 */
export function CategoryFilter({
  categories,
  selectedId,
  onSelect,
  hasMore,
  isLoadingMore,
  onLoadMore,
}: {
  categories: CategoryProject[];
  selectedId: number | undefined;
  onSelect: (id: number | undefined) => void;
  hasMore: boolean;
  isLoadingMore: boolean;
  onLoadMore: () => void;
}) {
  const t = useTranslations();
  const locale = useLocale();
  if (!categories.length) return null;
  const options = [
    { id: undefined, label: t("workFilterAll") },
    ...categories.map((category) => ({
      id: category.id,
      label: localize(locale, category.nameEn, category.nameAr),
    })),
  ];
  return (
    <div
      aria-label={t("workFilterLabel")}
      className="mx-auto mb-12 flex max-w-4xl flex-wrap justify-center gap-2.5"
      role="group"
    >
      {options.map((option) => {
        const active = option.id === selectedId;
        return (
          <button
            aria-pressed={active}
            className={cn(
              chipClass,
              active
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                : "border border-border bg-card text-muted-foreground shadow-sm hover:-translate-y-0.5 hover:border-primary/40 hover:text-foreground",
            )}
            key={option.id ?? "all"}
            onClick={() => onSelect(option.id)}
            type="button"
          >
            {option.label}
          </button>
        );
      })}
      {hasMore && (
        <button
          aria-busy={isLoadingMore}
          className={cn(
            chipClass,
            "border border-dashed border-primary/50 bg-primary/5 text-primary hover:bg-primary/10 disabled:opacity-70",
          )}
          disabled={isLoadingMore}
          onClick={onLoadMore}
          type="button"
        >
          {isLoadingMore ? (
            <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
          ) : (
            <Plus aria-hidden="true" className="size-4" />
          )}
          {t("workMoreCategories")}
        </button>
      )}
    </div>
  );
}
