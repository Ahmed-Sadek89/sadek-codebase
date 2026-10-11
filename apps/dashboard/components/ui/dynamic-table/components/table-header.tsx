"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@repo/ui/button";
import { FunnelX, Plus, RotateCw } from "@repo/ui/icons";
import { cn } from "@repo/ui/utils";
import { SearchInput } from "../../filters/search-input";
import { updateUrlParams } from "../../../../utils/url-params";
import { FILTER_PARAMS, PAGE_PARAM } from "../../../../utils/constants";

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
  showCreate?: boolean;
  makeCreateAction?: () => void
};

/**
 * Card header: title, count badge, description; on the side search, reset
 * filters (only while a filter is active), refresh and create.
 */
export function DynamicTableHeader({
  titleId,
  descriptionId,
  title,
  description,
  total,
  showSearch,
  onReload,
  isRefreshing,
  showCreate = false,
  makeCreateAction = () => { }
}: DynamicTableHeaderProps) {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const hasFilters = FILTER_PARAMS.some((name) =>
    Boolean(searchParams.get(name)),
  );
  const hasActions = showSearch || onReload || showCreate;

  // Clears the filters and goes back to the first page; `limit` stays.
  const resetFilters = () =>
    updateUrlParams({
      ...Object.fromEntries(FILTER_PARAMS.map((name) => [name, null])),
      [PAGE_PARAM]: null,
    });

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
        <div className="flex w-full flex-wrap items-center gap-2 sm:flex-nowrap lg:w-auto">
          {showSearch && (
            <SearchInput className="w-full flex-1 sm:max-w-none lg:w-64 lg:flex-none" />
          )}
          <div className="flex shrink-0 items-center gap-2">
            {hasFilters && (
              <Button
                type="button"
                variant="warning"
                size="sm"
                onClick={resetFilters}
                aria-label={t("tableResetFilters")}
                title={t("tableResetFilters")}
                className="gap-2"
              >
                <FunnelX className="size-4" aria-hidden />
                <span className="hidden sm:inline">
                  {t("tableResetFilters")}
                </span>
              </Button>
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
                className="gap-2"
              >
                <RotateCw
                  className={cn("size-4", isRefreshing && "animate-spin")}
                  aria-hidden
                />
                <span className="hidden sm:inline">{t("tableReload")}</span>
              </Button>
            )}
            {showCreate && (
              <Button
                type="button"
                variant="success"
                size="sm"
                aria-label={t("create")}
                title={t("create")}
                className="gap-2"
                onClick={makeCreateAction}
              >
                <Plus className="size-4" aria-hidden />
                <span className="hidden sm:inline">{t("create")}</span>
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
