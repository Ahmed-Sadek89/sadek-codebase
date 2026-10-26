import { apiClient } from "@repo/libs/axios";
import type { AuthorizedRequest } from "@repo/types/auth";
import type {
  CreateInstructorExperienceRequest,
  CreateInstructorExperienceResponse,
  DeleteInstructorExperienceResponse,
  InstructorExperience,
  InstructorExperiencesQuery,
  InstructorExperiencesResponse,
  ToggleInstructorExperienceActiveResponse,
  UpdateInstructorExperienceRequest,
  UpdateInstructorExperienceResponse,
} from "@repo/types/instructor-experience";
import { authHeaders } from "./auth-headers";

export const instructorExperienceEndpoints = {
  collection: "/instructor-experience",
  public: "/instructor-experience/public",
  byId: (id: number) => `/instructor-experience/${id}`,
  toggleActive: (id: number) => `/instructor-experience/${id}/toggle-active`,
} as const;

// GET /instructor-experience/public is public; every other route sits behind JwtAuthGuard.
export const instructorExperienceService = {
  async create(
    request: CreateInstructorExperienceRequest,
    auth: AuthorizedRequest,
  ): Promise<CreateInstructorExperienceResponse> {
    const { data } = await apiClient.post<CreateInstructorExperienceResponse>(
      instructorExperienceEndpoints.collection,
      request,
      { headers: authHeaders(auth) },
    );
    return data;
  },
  async findAll(
    query: InstructorExperiencesQuery,
    auth: AuthorizedRequest,
  ): Promise<InstructorExperiencesResponse> {
    const { data } = await apiClient.get<InstructorExperiencesResponse>(
      instructorExperienceEndpoints.collection,
      { params: query, headers: authHeaders(auth) },
    );
    return data;
  },
  /** GET /instructor-experience/public (no token): the default-view user's active rows. */
  async findAllPublic(
    query: InstructorExperiencesQuery,
  ): Promise<InstructorExperiencesResponse> {
    const { data } = await apiClient.get<InstructorExperiencesResponse>(
      instructorExperienceEndpoints.public,
      { params: query },
    );
    return data;
  },
  async findOne(
    id: number,
    auth: AuthorizedRequest,
  ): Promise<InstructorExperience> {
    const { data } = await apiClient.get<InstructorExperience>(
      instructorExperienceEndpoints.byId(id),
      { headers: authHeaders(auth) },
    );
    return data;
  },
  async update(
    id: number,
    request: UpdateInstructorExperienceRequest,
    auth: AuthorizedRequest,
  ): Promise<UpdateInstructorExperienceResponse> {
    const { data } = await apiClient.patch<UpdateInstructorExperienceResponse>(
      instructorExperienceEndpoints.byId(id),
      request,
      { headers: authHeaders(auth) },
    );
    return data;
  },
  /** Active ⇄ inactive. */
  async toggleActive(
    id: number,
    auth: AuthorizedRequest,
  ): Promise<ToggleInstructorExperienceActiveResponse> {
    const { data } =
      await apiClient.patch<ToggleInstructorExperienceActiveResponse>(
        instructorExperienceEndpoints.toggleActive(id),
        undefined,
        { headers: authHeaders(auth) },
      );
    return data;
  },
  async remove(
    id: number,
    auth: AuthorizedRequest,
  ): Promise<DeleteInstructorExperienceResponse> {
    const { data } = await apiClient.delete<DeleteInstructorExperienceResponse>(
      instructorExperienceEndpoints.byId(id),
      { headers: authHeaders(auth) },
    );
    return data;
  },
};
