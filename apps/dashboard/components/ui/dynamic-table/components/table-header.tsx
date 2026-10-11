"use client";

import { useTranslations } from "next-intl";
import { Button } from "@repo/ui/button";
import { Plus, RotateCw } from "@repo/ui/icons";
import { cn } from "@repo/ui/utils";
import { SearchInput } from "../../filters/search-input";

export type DynamicTableHeaderProps = {
  /** Ids the table uses for `aria-labelledby` / `aria-describedby`. */
  titleId: string;
  descriptionId: string;
  title: string;
  description?: string;
  /** Total matching rows; shown as a badge next to the title when known. */
  total?: number;
  showSearch: boolean;
  /** Renders the refresh button when set. */
  onReload?: () => void;
  isRefreshing: boolean;
  showCreate?: boolean
};

/** Card header: title, count badge, description; search and refresh on the side. */
export function DynamicTableHeader({
  titleId,
  descriptionId,
  title,
  description,
  total,
  showSearch,
  onReload,
  isRefreshing,
  showCreate = false
}: DynamicTableHeaderProps) {
  const t = useTranslations();
  const hasActions = showSearch || onReload;

  return (
    <header className="flex flex-col gap-4 border-b border-border p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
      <div className="min-w-0 space-y-1">
        <div className="flex items-center gap-2">
          <h2 id={titleId} className="truncate text-lg font-semibold">
            {title}
          </h2>
          {total !== undefined && (
            <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs font-medium tabular-nums text-muted-foreground">
              <span aria-hidden>{total}</span>
              <span className="sr-only">{t("tableTotal", { total })}</span>
            </span>
          )}
        </div>
        {description && (
          <p id={descriptionId} className="text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {hasActions && (
        <div className="flex w-full items-center gap-2 lg:w-auto">
          {showSearch && (
            <SearchInput className="w-full flex-1 sm:max-w-none lg:w-64 lg:flex-none" />
          )}
          {onReload && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onReload}
              disabled={isRefreshing}
              aria-busy={isRefreshing}
              aria-label={t("tableReload")}
              title={t("tableReload")}
              className="shrink-0 gap-2"
            >
              <RotateCw
                className={cn("size-4", isRefreshing && "animate-spin")}
                aria-hidden
              />
              <span className="hidden sm:inline">{t("tableReload")}</span>
            </Button>
          )}
          {
            showCreate &&
            <Button
              type="button"
              variant="default"
              size="sm"
              aria-label={t("create")}
              title={t("create")}
              className="shrink-0 gap-1"
            >
              <Plus
                className={cn("size-4")}
                aria-hidden
              />
              <span className="hidden sm:inline">{t("create")}</span>
            </Button>
          }
        </div>
      )}
    </header>
  );
}
