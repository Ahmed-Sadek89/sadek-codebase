"use client";

import { keepPreviousData, useQueryClient } from "@repo/libs/query";
import { pagesService } from "@repo/services/pages";
import type {
  CreatePageRequest,
  PagesQuery,
  UpdatePageRequest,
} from "@repo/types/pages";
import { queryKeys } from "@repo/utils/query-keys";
import { useGuardedMutation, useGuardedQuery } from "./api";

/** GET /pages: the signed-in user's website pages, paginated and searchable. */
export function usePages(
  query: PagesQuery = {},
  { enabled = true }: { enabled?: boolean } = {},
) {
  return useGuardedQuery({
    queryKey: queryKeys.pages.list(query),
    queryFn: (auth) => pagesService.findAll(query, auth),
    enabled,
    // Keep the current rows on screen while a new page or search loads.
    placeholderData: keepPreviousData,
  });
}

/** GET /pages/:id */
export function usePage(id: number | undefined) {
  return useGuardedQuery({
    queryKey: queryKeys.pages.detail(id ?? 0),
    queryFn: (auth) => pagesService.findOne(id!, auth),
    enabled: id !== undefined,
  });
}

export function useCreatePage() {
  const client = useQueryClient();
  return useGuardedMutation({
    mutationFn: (request: CreatePageRequest, auth) =>
      pagesService.create(request, auth),
    onSuccess: () =>
      client.invalidateQueries({ queryKey: queryKeys.pages.lists() }),
  });
}

/** SEO rows embed their page's names, so SEO lists and details refresh too. */
export function useUpdatePage() {
  const client = useQueryClient();
  return useGuardedMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePageRequest }, auth) =>
      pagesService.update(id, data, auth),
    onSuccess: (_response, { id }) =>
      Promise.all([
        client.invalidateQueries({ queryKey: queryKeys.pages.lists() }),
        client.invalidateQueries({ queryKey: queryKeys.pages.detail(id) }),
        client.invalidateQueries({ queryKey: queryKeys.seo.all }),
      ]),
  });
}

/** Deleting a page deletes its SEO row too, so every SEO query refreshes. */
export function useDeletePage() {
  const client = useQueryClient();
  return useGuardedMutation({
    mutationFn: (id: number, auth) => pagesService.remove(id, auth),
    onSuccess: (_response, id) => {
      client.removeQueries({ queryKey: queryKeys.pages.detail(id) });
      return Promise.all([
        client.invalidateQueries({ queryKey: queryKeys.pages.lists() }),
        client.invalidateQueries({ queryKey: queryKeys.seo.all }),
      ]);
    },
  });
}
