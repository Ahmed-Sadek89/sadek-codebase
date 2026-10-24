import { apiClient } from "@repo/libs/axios";
import type { AuthorizedRequest } from "@repo/types/auth";
import type {
  CreatePageRequest,
  CreatePageResponse,
  DeletePageResponse,
  PageDetails,
  PagesQuery,
  PagesResponse,
  UpdatePageRequest,
  UpdatePageResponse,
} from "@repo/types/pages";
import { authHeaders } from "./auth-headers";

export const pagesEndpoints = {
  collection: "/pages",
  byId: (id: number) => `/pages/${id}`,
} as const;

// Every route sits behind JwtAuthGuard and is scoped to the signed-in user.
export const pagesService = {
  async create(
    request: CreatePageRequest,
    auth: AuthorizedRequest,
  ): Promise<CreatePageResponse> {
    const { data } = await apiClient.post<CreatePageResponse>(
      pagesEndpoints.collection,
      request,
      { headers: authHeaders(auth) },
    );
    return data;
  },
  async findAll(
    query: PagesQuery,
    auth: AuthorizedRequest,
  ): Promise<PagesResponse> {
    const { data } = await apiClient.get<PagesResponse>(
      pagesEndpoints.collection,
      { params: query, headers: authHeaders(auth) },
    );
    return data;
  },
  async findOne(id: number, auth: AuthorizedRequest): Promise<PageDetails> {
    const { data } = await apiClient.get<PageDetails>(
      pagesEndpoints.byId(id),
      { headers: authHeaders(auth) },
    );
    return data;
  },
  async update(
    id: number,
    request: UpdatePageRequest,
    auth: AuthorizedRequest,
  ): Promise<UpdatePageResponse> {
    const { data } = await apiClient.patch<UpdatePageResponse>(
      pagesEndpoints.byId(id),
      request,
      { headers: authHeaders(auth) },
    );
    return data;
  },
  async remove(
    id: number,
    auth: AuthorizedRequest,
  ): Promise<DeletePageResponse> {
    const { data } = await apiClient.delete<DeletePageResponse>(
      pagesEndpoints.byId(id),
      { headers: authHeaders(auth) },
    );
    return data;
  },
};
