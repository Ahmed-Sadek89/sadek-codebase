"use client";

import type { MouseEvent } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@repo/ui/pagination";
import { PAGE_PARAM } from "../../../../utils/constants";
import { updateUrlParams } from "../../../../utils/url-params";

type PageItem = number | "ellipsis-start" | "ellipsis-end";

/** 1 … 4 5 6 … 10: first, last, and the current page with one neighbour each side. */
function getPageItems(page: number, totalPage: number): PageItem[] {
  if (totalPage <= 7) {
    return Array.from({ length: totalPage }, (_, index) => index + 1);
  }
  const start = Math.max(2, page - 1);
  const end = Math.min(totalPage - 1, page + 1);
  const middle = Array.from({ length: end - start + 1 }, (_, i) => start + i);
  return [
    1,
    ...(start > 2 ? (["ellipsis-start"] as const) : []),
    ...middle,
    ...(end < totalPage - 1 ? (["ellipsis-end"] as const) : []),
    totalPage,
  ];
}

export type TablePaginationProps = {
  page: number;
  totalPage: number;
};

/** shadcn Pagination that writes `?page=` to the URL (page 1 removes it). */
export function TablePagination({ page, totalPage }: TablePaginationProps) {
  const t = useTranslations();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Real hrefs keep links shareable and open-in-new-tab friendly.
  const hrefFor = (target: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (target <= 1) params.delete(PAGE_PARAM);
    else params.set(PAGE_PARAM, String(target));
    const query = params.toString();
    return query ? `${pathname}?${query}` : pathname;
  };

  // Plain clicks update the URL in place: no server render, only the query refetches.
  const goTo = (target: number) => (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0)
      return;
    event.preventDefault();
    updateUrlParams(
      { [PAGE_PARAM]: target <= 1 ? null : String(target) },
      "push",
    );
  };

  const isFirst = page <= 1;
  const isLast = page >= totalPage;

  return (
    <Pagination aria-label={t("paginationLabel")} className="mx-0 w-auto">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            label={t("paginationPrevious")}
            href={hrefFor(page - 1)}
            onClick={isFirst ? undefined : goTo(page - 1)}
            aria-disabled={isFirst || undefined}
            tabIndex={isFirst ? -1 : undefined}
          />
        </PaginationItem>
        {getPageItems(page, totalPage).map((item) =>
          typeof item === "number" ? (
            <PaginationItem key={item}>
              <PaginationLink
                href={hrefFor(item)}
                onClick={goTo(item)}
                isActive={item === page}
                aria-label={t("paginationPage", { page: item })}
              >
                {item}
              </PaginationLink>
            </PaginationItem>
          ) : (
            <PaginationItem key={item}>
              <PaginationEllipsis label={t("paginationMore")} />
            </PaginationItem>
          ),
        )}
        <PaginationItem>
          <PaginationNext
            label={t("paginationNext")}
            href={hrefFor(page + 1)}
            onClick={isLast ? undefined : goTo(page + 1)}
            aria-disabled={isLast || undefined}
            tabIndex={isLast ? -1 : undefined}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
