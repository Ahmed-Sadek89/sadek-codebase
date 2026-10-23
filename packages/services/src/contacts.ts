import { apiClient } from "@repo/libs/axios";
import type { AuthorizedRequest } from "@repo/types/auth";
import type {
  ContactDetails,
  ContactsQuery,
  ContactsResponse,
  CreateContactRequest,
  CreateContactResponse,
  DeleteContactResponse,
} from "@repo/types/contacts";
import { authHeaders } from "./auth-headers";

export const contactsEndpoints = {
  collection: "/contacts",
  byId: (id: number) => `/contacts/${id}`,
} as const;

// POST /contacts is public (the portfolio's contact form); every other route
// sits behind JwtAuthGuard and only sees the signed-in user's messages.
export const contactsService = {
  /** POST /contacts (no token): sends a message to the default-view user. */
  async create(request: CreateContactRequest): Promise<CreateContactResponse> {
    const { data } = await apiClient.post<CreateContactResponse>(
      contactsEndpoints.collection,
      request,
    );
    return data;
  },
  async findAll(
    query: ContactsQuery,
    auth: AuthorizedRequest,
  ): Promise<ContactsResponse> {
    const { data } = await apiClient.get<ContactsResponse>(
      contactsEndpoints.collection,
      { params: query, headers: authHeaders(auth) },
    );
    return data;
  },
  async findOne(id: number, auth: AuthorizedRequest): Promise<ContactDetails> {
    const { data } = await apiClient.get<ContactDetails>(
      contactsEndpoints.byId(id),
      { headers: authHeaders(auth) },
    );
    return data;
  },
  async remove(
    id: number,
    auth: AuthorizedRequest,
  ): Promise<DeleteContactResponse> {
    const { data } = await apiClient.delete<DeleteContactResponse>(
      contactsEndpoints.byId(id),
      { headers: authHeaders(auth) },
    );
    return data;
  },
};
