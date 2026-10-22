import { apiClient } from "@repo/libs/axios";
import type { AuthorizedRequest } from "@repo/types/auth";
import type {
  CategoryProjectDetails,
  CategoryProjectsQuery,
  CategoryProjectsResponse,
  CreateCategoryProjectRequest,
  CreateCategoryProjectResponse,
  DeleteCategoryProjectResponse,
  UpdateCategoryProjectRequest,
  UpdateCategoryProjectResponse,
} from "@repo/types/category-projects";
import { authHeaders } from "./auth-headers";

export const categoryProjectsEndpoints = {
  collection: "/category-projects",
  public: "/category-projects/public",
  byId: (id: number) => `/category-projects/${id}`,
} as const;

// GET /category-projects/public is public; every other route sits behind JwtAuthGuard.
export const categoryProjectsService = {
  async create(
    request: CreateCategoryProjectRequest,
    auth: AuthorizedRequest,
  ): Promise<CreateCategoryProjectResponse> {
    const { data } = await apiClient.post<CreateCategoryProjectResponse>(
      categoryProjectsEndpoints.collection,
      request,
      { headers: authHeaders(auth) },
    );
    return data;
  },
  async findAll(
    query: CategoryProjectsQuery,
    auth: AuthorizedRequest,
  ): Promise<CategoryProjectsResponse> {
    const { data } = await apiClient.get<CategoryProjectsResponse>(
      categoryProjectsEndpoints.collection,
      { params: query, headers: authHeaders(auth) },
    );
    return data;
  },
  /** GET /category-projects/public (no token): the default-view user's rows. */
  async findAllPublic(
    query: CategoryProjectsQuery,
  ): Promise<CategoryProjectsResponse> {
    const { data } = await apiClient.get<CategoryProjectsResponse>(
      categoryProjectsEndpoints.public,
      { params: query },
    );
    return data;
  },
  async findOne(
    id: number,
    auth: AuthorizedRequest,
  ): Promise<CategoryProjectDetails> {
    const { data } = await apiClient.get<CategoryProjectDetails>(
      categoryProjectsEndpoints.byId(id),
      { headers: authHeaders(auth) },
    );
    return data;
  },
  async update(
    id: number,
    request: UpdateCategoryProjectRequest,
    auth: AuthorizedRequest,
  ): Promise<UpdateCategoryProjectResponse> {
    const { data } = await apiClient.patch<UpdateCategoryProjectResponse>(
      categoryProjectsEndpoints.byId(id),
      request,
      { headers: authHeaders(auth) },
    );
    return data;
  },
  async remove(
    id: number,
    auth: AuthorizedRequest,
  ): Promise<DeleteCategoryProjectResponse> {
    const { data } = await apiClient.delete<DeleteCategoryProjectResponse>(
      categoryProjectsEndpoints.byId(id),
      { headers: authHeaders(auth) },
    );
    return data;
  },
};
