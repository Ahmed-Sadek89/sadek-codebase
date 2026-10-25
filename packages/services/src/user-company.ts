import { apiClient } from "@repo/libs/axios";
import type { AuthorizedRequest } from "@repo/types/auth";
import type {
  CreateUserCompanyRequest,
  CreateUserCompanyResponse,
  DeleteUserCompanyResponse,
  MyUserCompaniesResponse,
  ToggleUserCompanyActiveResponse,
  UpdateUserCompanyRequest,
  UpdateUserCompanyResponse,
  UserCompaniesQuery,
  UserCompaniesResponse,
  UserCompanyDetails,
} from "@repo/types/user-company";
import { authHeaders } from "./auth-headers";

export const userCompanyEndpoints = {
  collection: "/user-company",
  public: "/user-company/public",
  me: "/user-company/me",
  byId: (id: number) => `/user-company/${id}`,
  toggleActive: (id: number) => `/user-company/${id}/toggle-active`,
} as const;

// GET /user-company/public is public; every other route sits behind JwtAuthGuard
// and only sees the signed-in user's companies.
export const userCompanyService = {
  async create(
    request: CreateUserCompanyRequest,
    auth: AuthorizedRequest,
  ): Promise<CreateUserCompanyResponse> {
    const { data } = await apiClient.post<CreateUserCompanyResponse>(
      userCompanyEndpoints.collection,
      request,
      { headers: authHeaders(auth) },
    );
    return data;
  },
  async findAll(
    query: UserCompaniesQuery,
    auth: AuthorizedRequest,
  ): Promise<UserCompaniesResponse> {
    const { data } = await apiClient.get<UserCompaniesResponse>(
      userCompanyEndpoints.collection,
      { params: query, headers: authHeaders(auth) },
    );
    return data;
  },
  /** GET /user-company/public (no token): the default-view user's rows. */
  async findAllPublic(
    query: UserCompaniesQuery,
  ): Promise<UserCompaniesResponse> {
    const { data } = await apiClient.get<UserCompaniesResponse>(
      userCompanyEndpoints.public,
      { params: query },
    );
    return data;
  },
  async findMine(
    query: UserCompaniesQuery,
    auth: AuthorizedRequest,
  ): Promise<MyUserCompaniesResponse> {
    const { data } = await apiClient.get<MyUserCompaniesResponse>(
      userCompanyEndpoints.me,
      { params: query, headers: authHeaders(auth) },
    );
    return data;
  },
  async findOne(
    id: number,
    auth: AuthorizedRequest,
  ): Promise<UserCompanyDetails> {
    const { data } = await apiClient.get<UserCompanyDetails>(
      userCompanyEndpoints.byId(id),
      { headers: authHeaders(auth) },
    );
    return data;
  },
  async update(
    id: number,
    request: UpdateUserCompanyRequest,
    auth: AuthorizedRequest,
  ): Promise<UpdateUserCompanyResponse> {
    const { data } = await apiClient.patch<UpdateUserCompanyResponse>(
      userCompanyEndpoints.byId(id),
      request,
      { headers: authHeaders(auth) },
    );
    return data;
  },
  /** Active ⇄ inactive. */
  async toggleActive(
    id: number,
    auth: AuthorizedRequest,
  ): Promise<ToggleUserCompanyActiveResponse> {
    const { data } = await apiClient.patch<ToggleUserCompanyActiveResponse>(
      userCompanyEndpoints.toggleActive(id),
      undefined,
      { headers: authHeaders(auth) },
    );
    return data;
  },
  async remove(
    id: number,
    auth: AuthorizedRequest,
  ): Promise<DeleteUserCompanyResponse> {
    const { data } = await apiClient.delete<DeleteUserCompanyResponse>(
      userCompanyEndpoints.byId(id),
      { headers: authHeaders(auth) },
    );
    return data;
  },
};
