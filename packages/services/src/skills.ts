import { apiClient } from "@repo/libs/axios";
import type { AuthorizedRequest } from "@repo/types/auth";
import type {
  CreateManySkillsRequest,
  CreateManySkillsResponse,
  CreateSkillRequest,
  CreateSkillResponse,
  DeleteSkillResponse,
  ToggleSkillActiveResponse,
  Skill,
  SkillsQuery,
  SkillsResponse,
  UpdateSkillRequest,
  UpdateSkillResponse,
} from "@repo/types/skills";
import { authHeaders } from "./auth-headers";

export const skillsEndpoints = {
  collection: "/skills",
  bulk: "/skills/bulk",
  byId: (id: number) => `/skills/${id}`,
  toggleActive: (id: number) => `/skills/${id}/toggle-active`,
} as const;

// Every skills route is guarded and scoped to the signed-in user.
export const skillsService = {
  async create(
    request: CreateSkillRequest,
    auth: AuthorizedRequest,
  ): Promise<CreateSkillResponse> {
    const { data } = await apiClient.post<CreateSkillResponse>(
      skillsEndpoints.collection,
      request,
      { headers: authHeaders(auth) },
    );
    return data;
  },
  /** Many skills with the same categories in one request. */
  async createMany(
    request: CreateManySkillsRequest,
    auth: AuthorizedRequest,
  ): Promise<CreateManySkillsResponse> {
    const { data } = await apiClient.post<CreateManySkillsResponse>(
      skillsEndpoints.bulk,
      request,
      { headers: authHeaders(auth) },
    );
    return data;
  },
  async findAll(
    query: SkillsQuery,
    auth: AuthorizedRequest,
  ): Promise<SkillsResponse> {
    const { data } = await apiClient.get<SkillsResponse>(
      skillsEndpoints.collection,
      { params: query, headers: authHeaders(auth) },
    );
    return data;
  },
  async findOne(id: number, auth: AuthorizedRequest): Promise<Skill> {
    const { data } = await apiClient.get<Skill>(skillsEndpoints.byId(id), {
      headers: authHeaders(auth),
    });
    return data;
  },
  async update(
    id: number,
    request: UpdateSkillRequest,
    auth: AuthorizedRequest,
  ): Promise<UpdateSkillResponse> {
    const { data } = await apiClient.patch<UpdateSkillResponse>(
      skillsEndpoints.byId(id),
      request,
      { headers: authHeaders(auth) },
    );
    return data;
  },
  /** Active ⇄ inactive. */
  async toggleActive(
    id: number,
    auth: AuthorizedRequest,
  ): Promise<ToggleSkillActiveResponse> {
    const { data } = await apiClient.patch<ToggleSkillActiveResponse>(
      skillsEndpoints.toggleActive(id),
      undefined,
      { headers: authHeaders(auth) },
    );
    return data;
  },
  async remove(
    id: number,
    auth: AuthorizedRequest,
  ): Promise<DeleteSkillResponse> {
    const { data } = await apiClient.delete<DeleteSkillResponse>(
      skillsEndpoints.byId(id),
      { headers: authHeaders(auth) },
    );
    return data;
  },
};
