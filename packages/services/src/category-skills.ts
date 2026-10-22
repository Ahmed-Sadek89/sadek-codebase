import { apiClient } from "@repo/libs/axios";
import type { AuthorizedRequest } from "@repo/types/auth";
import type {
  CategorySkillDetails,
  CategorySkillsQuery,
  CategorySkillsResponse,
  CreateCategorySkillRequest,
  CreateCategorySkillResponse,
  DeleteCategorySkillResponse,
  UpdateCategorySkillRequest,
  UpdateCategorySkillResponse,
} from "@repo/types/category-skills";
import { authHeaders } from "./auth-headers";

export const categorySkillsEndpoints = {
  create: "/category-skills",
  findAll: "/category-skills/private",
  public: "/category-skills/public",
  byId: (id: number) => `/category-skills/${id}`,
} as const;

// GET /category-skills/public is public; every other route sits behind JwtAuthGuard.
export const categorySkillsService = {
  async create(
    request: CreateCategorySkillRequest,
    auth: AuthorizedRequest,
  ): Promise<CreateCategorySkillResponse> {
    const { data } = await apiClient.post<CreateCategorySkillResponse>(
      categorySkillsEndpoints.create,
      request,
      { headers: authHeaders(auth) },
    );
    return data;
  },
  async findAll(
    query: CategorySkillsQuery,
    auth: AuthorizedRequest,
  ): Promise<CategorySkillsResponse> {
    const { data } = await apiClient.get<CategorySkillsResponse>(
      categorySkillsEndpoints.findAll,
      { params: query, headers: authHeaders(auth) },
    );
    return data;
  },
  /** GET /category-skills/public (no token): the default-view user's rows. */
  async findAllPublic(
    query: CategorySkillsQuery,
  ): Promise<CategorySkillsResponse> {
    const { data } = await apiClient.get<CategorySkillsResponse>(
      categorySkillsEndpoints.public,
      { params: query },
    );
    return data;
  },
  async findOne(
    id: number,
    auth: AuthorizedRequest,
  ): Promise<CategorySkillDetails> {
    const { data } = await apiClient.get<CategorySkillDetails>(
      categorySkillsEndpoints.byId(id),
      { headers: authHeaders(auth) },
    );
    return data;
  },
  async update(
    id: number,
    request: UpdateCategorySkillRequest,
    auth: AuthorizedRequest,
  ): Promise<UpdateCategorySkillResponse> {
    const { data } = await apiClient.patch<UpdateCategorySkillResponse>(
      categorySkillsEndpoints.byId(id),
      request,
      { headers: authHeaders(auth) },
    );
    return data;
  },
  async remove(
    id: number,
    auth: AuthorizedRequest,
  ): Promise<DeleteCategorySkillResponse> {
    const { data } = await apiClient.delete<DeleteCategorySkillResponse>(
      categorySkillsEndpoints.byId(id),
      { headers: authHeaders(auth) },
    );
    return data;
  },
};
