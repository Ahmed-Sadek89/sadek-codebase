"use client";

import { keepPreviousData, useQueryClient } from "@repo/libs/query";
import { contactsService } from "@repo/services/contacts";
import type { ContactsQuery, CreateContactRequest } from "@repo/types/contacts";
import { queryKeys } from "@repo/utils/query-keys";
import { useGuardedMutation, useGuardedQuery, usePublicMutation } from "./api";

/** GET /contacts: the signed-in user's messages, paginated and searchable. */
export function useContacts(query: ContactsQuery = {}) {
  return useGuardedQuery({
    queryKey: queryKeys.contacts.list(query),
    queryFn: (auth) => contactsService.findAll(query, auth),
    // Keep the current rows on screen while a new page or search loads.
    placeholderData: keepPreviousData,
  });
}

/** GET /contacts/:id */
export function useContact(id: number | undefined) {
  return useGuardedQuery({
    queryKey: queryKeys.contacts.detail(id ?? 0),
    queryFn: (auth) => contactsService.findOne(id!, auth),
    enabled: id !== undefined,
  });
}

/** POST /contacts (public): the portfolio's contact form. No sign-in needed. */
export function useCreateContact() {
  const client = useQueryClient();
  return usePublicMutation({
    mutationFn: (request: CreateContactRequest) =>
      contactsService.create(request),
    // Refreshes the owner's inbox when they send from a signed-in session.
    onSuccess: () =>
      client.invalidateQueries({ queryKey: queryKeys.contacts.lists() }),
  });
}

export function useDeleteContact() {
  const client = useQueryClient();
  return useGuardedMutation({
    mutationFn: (id: number, auth) => contactsService.remove(id, auth),
    onSuccess: (_response, id) => {
      client.removeQueries({ queryKey: queryKeys.contacts.detail(id) });
      return client.invalidateQueries({ queryKey: queryKeys.contacts.lists() });
    },
  });
}
