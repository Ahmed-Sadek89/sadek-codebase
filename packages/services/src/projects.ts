import { apiClient } from "@repo/libs/axios";
import type { AuthorizedRequest } from "@repo/types/auth";
import type {
  CreateProjectRequest,
  CreateProjectResponse,
  DeleteProjectResponse,
  ProjectDetails,
  ProjectsResponse,
  UpdateProjectRequest,
  UpdateProjectResponse,
} from "@repo/types/projects";
import { authHeaders } from "./auth-headers";

export const projectsEndpoints = {
  collection: "/projects",
  byId: (id: number) => `/projects/${id}`,
} as const;

// Every projects route sits behind JwtAuthGuard.
export const projectsService = {
  async create(
    request: CreateProjectRequest,
    auth: AuthorizedRequest,
  ): Promise<CreateProjectResponse> {
    const { data } = await apiClient.post<CreateProjectResponse>(
      projectsEndpoints.collection,
      request,
      { headers: authHeaders(auth) },
    );
    return data;
  },
  /** Not paginated: the backend returns every project of the signed-in user. */
  async findAll(auth: AuthorizedRequest): Promise<ProjectsResponse> {
    const { data } = await apiClient.get<ProjectsResponse>(
      projectsEndpoints.collection,
      { headers: authHeaders(auth) },
    );
    return data;
  },
  async findOne(id: number, auth: AuthorizedRequest): Promise<ProjectDetails> {
    const { data } = await apiClient.get<ProjectDetails>(
      projectsEndpoints.byId(id),
      { headers: authHeaders(auth) },
    );
    return data;
  },
  async update(
    id: number,
    request: UpdateProjectRequest,
    auth: AuthorizedRequest,
  ): Promise<UpdateProjectResponse> {
    const { data } = await apiClient.patch<UpdateProjectResponse>(
      projectsEndpoints.byId(id),
      request,
      { headers: authHeaders(auth) },
    );
    return data;
  },
  async remove(
    id: number,
    auth: AuthorizedRequest,
  ): Promise<DeleteProjectResponse> {
    const { data } = await apiClient.delete<DeleteProjectResponse>(
      projectsEndpoints.byId(id),
      { headers: authHeaders(auth) },
    );
    return data;
  },
};
