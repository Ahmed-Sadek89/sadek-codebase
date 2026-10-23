import type { ContactsQuery } from "@repo/types/contacts";
import type { ListQueryParams } from "../../../utils/list-query";

/** Page size when the URL has no `?limit=`. */
export const CONTACTS_LIMIT = 10;

/**
 * The list query for the URL's `search`, `page`, `limit`, and `order` (any
 * combination). GET /contacts has no `isActive`, so it is left out (the
 * backend rejects unknown params with 400). Shared by the server prefetch
 * and the client hook so both build the same query key.
 */
export function getContactsQuery(params: ListQueryParams): ContactsQuery {
  const { search, page, limit, order } = params;
  return {
    limit: limit ?? CONTACTS_LIMIT,
    ...(search && { search }),
    ...(page !== undefined && { page }),
    ...(order && { order }),
  };
}
