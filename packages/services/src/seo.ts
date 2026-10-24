import { apiClient } from "@repo/libs/axios";
import type { AuthorizedRequest } from "@repo/types/auth";
import type {
  CreateSeoRequest,
  CreateSeoResponse,
  DeleteSeoResponse,
  SeoDetails,
  SeoPageName,
  ToggleSeoActiveResponse,
  SeoListQuery,
  SeoListResponse,
  UpdateSeoRequest,
  UpdateSeoResponse,
} from "@repo/types/seo";
import { authHeaders } from "./auth-headers";

export const seoEndpoints = {
  collection: "/seo",
  public: (pageName: SeoPageName) => `/seo/public/${pageName}`,
  byId: (id: number) => `/seo/${id}`,
  toggleActive: (id: number) => `/seo/${id}/toggle-active`,
} as const;

// GET /seo/public/:pageName is public; every other route sits behind JwtAuthGuard.
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
  /** GET /seo/public/:pageName (no token): the default-view user's active row for that page; 404 when none. */
  async findPublic(pageName: SeoPageName): Promise<SeoDetails> {
    const { data } = await apiClient.get<SeoDetails>(
      seoEndpoints.public(pageName),
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
  /** Live ⇄ offline. Going live deactivates the user's other rows for that page. */
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
