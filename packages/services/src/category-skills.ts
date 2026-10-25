import { apiClient } from "@repo/libs/axios";
import type { AuthorizedRequest } from "@repo/types/auth";
import type {
  CategorySkillDetails,
  CategorySkillsQuery,
  CategorySkillsResponse,
  CreateCategorySkillRequest,
  CreateCategorySkillResponse,
  DeleteCategorySkillResponse,
  PublicCategorySkillsResponse,
  ToggleCategorySkillActiveResponse,
  UpdateCategorySkillRequest,
  UpdateCategorySkillResponse,
} from "@repo/types/category-skills";
import { authHeaders } from "./auth-headers";

export const categorySkillsEndpoints = {
  create: "/category-skills",
  findAll: "/category-skills/private",
  public: "/category-skills/public",
  byId: (id: number) => `/category-skills/${id}`,
  toggleActive: (id: number) => `/category-skills/${id}/toggle-active`,
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
  /** GET /category-skills/public (no token): the default-view user's categories, each with up to 20 skills. */
  async findAllPublic(
    query: CategorySkillsQuery,
  ): Promise<PublicCategorySkillsResponse> {
    const { data } = await apiClient.get<PublicCategorySkillsResponse>(
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
  /** Active ⇄ inactive. */
  async toggleActive(
    id: number,
    auth: AuthorizedRequest,
  ): Promise<ToggleCategorySkillActiveResponse> {
    const { data } = await apiClient.patch<ToggleCategorySkillActiveResponse>(
      categorySkillsEndpoints.toggleActive(id),
      undefined,
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
