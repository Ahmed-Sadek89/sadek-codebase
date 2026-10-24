"use client";

import { keepPreviousData, useQueryClient } from "@repo/libs/query";
import { seoService } from "@repo/services/seo";
import type {
  CreateSeoRequest,
  SeoListQuery,
  SeoPageName,
  UpdateSeoRequest,
} from "@repo/types/seo";
import { queryKeys } from "@repo/utils/query-keys";
import { useGuardedMutation, useGuardedQuery, usePublicQuery } from "./api";

/** GET /seo: the signed-in user's SEO rows for every page, paginated and filtered. */
export function useSeoList(query: SeoListQuery = {}) {
  return useGuardedQuery({
    queryKey: queryKeys.seo.list(query),
    queryFn: (auth) => seoService.findAll(query, auth),
    // Keep the current rows on screen while a new page or search loads.
    placeholderData: keepPreviousData,
  });
}

/** GET /seo/public/:pageName: the website's active SEO for one page. No sign-in needed. */
export function usePublicSeo(pageName: SeoPageName) {
  return usePublicQuery({
    queryKey: queryKeys.seo.public(pageName),
    queryFn: () => seoService.findPublic(pageName),
  });
}

/** GET /seo/:id */
export function useSeo(id: number | undefined) {
  return useGuardedQuery({
    queryKey: queryKeys.seo.detail(id ?? 0),
    queryFn: (auth) => seoService.findOne(id!, auth),
    enabled: id !== undefined,
  });
}

export function useCreateSeo() {
  const client = useQueryClient();
  return useGuardedMutation({
    mutationFn: (request: CreateSeoRequest, auth) =>
      seoService.create(request, auth),
    onSuccess: () =>
      client.invalidateQueries({ queryKey: queryKeys.seo.lists() }),
  });
}

export function useUpdateSeo() {
  const client = useQueryClient();
  return useGuardedMutation({
    mutationFn: (
      { id, data }: { id: number; data: UpdateSeoRequest },
      auth,
    ) => seoService.update(id, data, auth),
    onSuccess: (_response, { id }) =>
      Promise.all([
        client.invalidateQueries({ queryKey: queryKeys.seo.lists() }),
        client.invalidateQueries({
          queryKey: queryKeys.seo.detail(id),
        }),
      ]),
  });
}

/**
 * PATCH /seo/:id/toggle-active. Going live can deactivate another row of the
 * same page, so every row's detail is refreshed.
 */
export function useToggleSeoActive() {
  const client = useQueryClient();
  return useGuardedMutation({
    mutationFn: (id: number, auth) => seoService.toggleActive(id, auth),
    onSuccess: () =>
      Promise.all([
        client.invalidateQueries({ queryKey: queryKeys.seo.lists() }),
        client.invalidateQueries({
          queryKey: queryKeys.seo.details(),
        }),
      ]),
  });
}

export function useDeleteSeo() {
  const client = useQueryClient();
  return useGuardedMutation({
    mutationFn: (id: number, auth) => seoService.remove(id, auth),
    onSuccess: (_response, id) => {
      client.removeQueries({ queryKey: queryKeys.seo.detail(id) });
      return client.invalidateQueries({
        queryKey: queryKeys.seo.lists(),
      });
    },
  });
}
