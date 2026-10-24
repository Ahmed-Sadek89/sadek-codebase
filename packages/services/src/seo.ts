import { apiClient } from "@repo/libs/axios";
import type { AuthorizedRequest } from "@repo/types/auth";
import type {
  CreateSeoRequest,
  CreateSeoResponse,
  DeleteSeoResponse,
  SeoDetails,
  ToggleSeoActiveResponse,
  SeoListQuery,
  SeoListResponse,
  UpdateSeoRequest,
  UpdateSeoResponse,
} from "@repo/types/seo";
import { authHeaders } from "./auth-headers";

export const seoEndpoints = {
  collection: "/seo",
  public: (pageId: number) => `/seo/public/${pageId}`,
  byId: (id: number) => `/seo/${id}`,
  toggleActive: (id: number) => `/seo/${id}/toggle-active`,
} as const;

// GET /seo/public/:pageId is public; every other route sits behind JwtAuthGuard.
export const seoService = {
  async create(
    request: CreateSeoRequest,
    auth: AuthorizedRequest,
  ): Promise<CreateSeoResponse> {
    const { data } = await apiClient.post<CreateSeoResponse>(
      seoEndpoints.collection,
      request,
      { headers: authHeaders(auth) },
    );
    return data;
  },
  async findAll(
    query: SeoListQuery,
    auth: AuthorizedRequest,
  ): Promise<SeoListResponse> {
    const { data } = await apiClient.get<SeoListResponse>(
      seoEndpoints.collection,
      { params: query, headers: authHeaders(auth) },
    );
    return data;
  },
  /** GET /seo/public/:pageId (no token): the page's active SEO of the default-view user; 404 when none. */
  async findPublic(pageId: number): Promise<SeoDetails> {
    const { data } = await apiClient.get<SeoDetails>(
      seoEndpoints.public(pageId),
    );
    return data;
  },
  async findOne(
    id: number,
    auth: AuthorizedRequest,
  ): Promise<SeoDetails> {
    const { data } = await apiClient.get<SeoDetails>(
      seoEndpoints.byId(id),
      { headers: authHeaders(auth) },
    );
    return data;
  },
  async update(
    id: number,
    request: UpdateSeoRequest,
    auth: AuthorizedRequest,
  ): Promise<UpdateSeoResponse> {
    const { data } = await apiClient.patch<UpdateSeoResponse>(
      seoEndpoints.byId(id),
      request,
      { headers: authHeaders(auth) },
    );
    return data;
  },
  /** Live ⇄ offline. */
  async toggleActive(
    id: number,
    auth: AuthorizedRequest,
  ): Promise<ToggleSeoActiveResponse> {
    const { data } = await apiClient.patch<ToggleSeoActiveResponse>(
      seoEndpoints.toggleActive(id),
      undefined,
      { headers: authHeaders(auth) },
    );
    return data;
  },
  async remove(
    id: number,
    auth: AuthorizedRequest,
  ): Promise<DeleteSeoResponse> {
    const { data } = await apiClient.delete<DeleteSeoResponse>(
      seoEndpoints.byId(id),
      { headers: authHeaders(auth) },
    );
    return data;
  },
};
