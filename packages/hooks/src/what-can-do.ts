"use client";

import {
  keepPreviousData,
  useQueryClient,
  type QueryClient,
} from "@repo/libs/query";
import { whatCanDoService } from "@repo/services/what-can-do";
import type {
  CreateWhatCanDoRequest,
  UpdateWhatCanDoRequest,
  WhatCanDosQuery,
} from "@repo/types/what-can-do";
import { queryKeys } from "@repo/utils/query-keys";
import { useGuardedMutation, useGuardedQuery, usePublicQuery } from "./api";

// GET /what-can-do/me returns the same rows as the list, so refresh both.
function invalidateWhatCanDoLists(client: QueryClient) {
  return Promise.all([
    client.invalidateQueries({ queryKey: queryKeys.whatCanDo.lists() }),
    client.invalidateQueries({ queryKey: queryKeys.whatCanDo.mines() }),
  ]);
}

/** GET /what-can-do: the signed-in user's items, paginated. */
export function useWhatCanDos(query: WhatCanDosQuery = {}) {
  return useGuardedQuery({
    queryKey: queryKeys.whatCanDo.list(query),
    queryFn: (auth) => whatCanDoService.findAll(query, auth),
    // Keep the current rows on screen while a new page loads.
    placeholderData: keepPreviousData,
  });
}

/** GET /what-can-do/public: the default-view user's items, paginated. No sign-in needed. */
export function usePublicWhatCanDos(query: WhatCanDosQuery = {}) {
  return usePublicQuery({
    queryKey: queryKeys.whatCanDo.publicList(query),
    queryFn: () => whatCanDoService.findAllPublic(query),
    // Keep the current rows on screen while a new page or search loads.
    placeholderData: keepPreviousData,
  });
}

/** GET /what-can-do/me: the signed-in user's items, paginated by rank (lowest first by default). */
export function useMyWhatCanDos(query: WhatCanDosQuery = {}) {
  return useGuardedQuery({
    queryKey: queryKeys.whatCanDo.mine(query),
    queryFn: (auth) => whatCanDoService.findMine(query, auth),
    placeholderData: keepPreviousData,
  });
}

/** GET /what-can-do/:id */
export function useWhatCanDo(id: number | undefined) {
  return useGuardedQuery({
    queryKey: queryKeys.whatCanDo.detail(id ?? 0),
    queryFn: (auth) => whatCanDoService.findOne(id!, auth),
    enabled: id !== undefined,
  });
}

export function useCreateWhatCanDo() {
  const client = useQueryClient();
  return useGuardedMutation({
    mutationFn: (request: CreateWhatCanDoRequest, auth) =>
      whatCanDoService.create(request, auth),
    onSuccess: () => invalidateWhatCanDoLists(client),
  });
}

export function useUpdateWhatCanDo() {
  const client = useQueryClient();
  return useGuardedMutation({
    mutationFn: (
      { id, data }: { id: number; data: UpdateWhatCanDoRequest },
      auth,
    ) => whatCanDoService.update(id, data, auth),
    onSuccess: (_response, { id }) =>
      Promise.all([
        invalidateWhatCanDoLists(client),
        client.invalidateQueries({ queryKey: queryKeys.whatCanDo.detail(id) }),
      ]),
  });
}

export function useDeleteWhatCanDo() {
  const client = useQueryClient();
  return useGuardedMutation({
    mutationFn: (id: number, auth) => whatCanDoService.remove(id, auth),
    onSuccess: (_response, id) => {
      client.removeQueries({ queryKey: queryKeys.whatCanDo.detail(id) });
      return invalidateWhatCanDoLists(client);
    },
  });
}
