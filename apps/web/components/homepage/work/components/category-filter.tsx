import { useLocale, useTranslations } from "next-intl";
import type { CategoryProject } from "@repo/types/category-projects";
import { cn } from "@repo/ui/utils";
import { localize } from "../../../../utils/localize";

export function CategoryFilter({
  categories,
  selectedId,
  onSelect,
}: {
  categories: CategoryProject[];
  selectedId: number | undefined;
  onSelect: (id: number | undefined) => void;
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
      className="mb-[27px] flex flex-wrap justify-center gap-[7px]"
      role="group"
    >
      {options.map((option) => (
        <button
          aria-pressed={option.id === selectedId}
          className={cn(
            "rounded-[20px] px-[11px] py-[5px] text-[10px]",
            option.id === selectedId
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:text-primary",
          )}
          key={option.id ?? "all"}
          onClick={() => onSelect(option.id)}
          type="button"
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
