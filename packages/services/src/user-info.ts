import { apiClient } from "@repo/libs/axios";
import type { AuthorizedRequest } from "@repo/types/auth";
import type {
  CreateUserInfoRequest,
  CreateUserInfoResponse,
  DeleteUserInfoResponse,
  MyUserInfoResponse,
  PublicUserInfoResponse,
  UpdateUserInfoRequest,
  UpdateUserInfoResponse,
  UserInfoDetails,
  UserInfoQuery,
  UserInfoResponse,
} from "@repo/types/user-info";
import { authHeaders } from "./auth-headers";

export const userInfoEndpoints = {
  collection: "/user-info",
  public: "/user-info/public",
  me: "/user-info/me",
  byId: (id: number) => `/user-info/${id}`,
} as const;

// GET /user-info/public is public; every other route sits behind JwtAuthGuard.
// GET /user-info lists every user's row; GET /user-info/me returns only the
// signed-in user's.
export const userInfoService = {
  async create(
    request: CreateUserInfoRequest,
    auth: AuthorizedRequest,
  ): Promise<CreateUserInfoResponse> {
    const { data } = await apiClient.post<CreateUserInfoResponse>(
      userInfoEndpoints.collection,
      request,
      { headers: authHeaders(auth) },
    );
    return data;
  },
  async findAll(
    query: UserInfoQuery,
    auth: AuthorizedRequest,
  ): Promise<UserInfoResponse> {
    const { data } = await apiClient.get<UserInfoResponse>(
      userInfoEndpoints.collection,
      { params: query, headers: authHeaders(auth) },
    );
    return data;
  },
  /** GET /user-info/public (no token): the default-view user's row; 404 when there is none. */
  async findPublic(): Promise<PublicUserInfoResponse> {
    const { data } = await apiClient.get<PublicUserInfoResponse>(
      userInfoEndpoints.public,
    );
    return data;
  },
  async findMine(auth: AuthorizedRequest): Promise<MyUserInfoResponse> {
    const { data } = await apiClient.get<MyUserInfoResponse>(
      userInfoEndpoints.me,
      { headers: authHeaders(auth) },
    );
    return data;
  },
  async findOne(id: number, auth: AuthorizedRequest): Promise<UserInfoDetails> {
    const { data } = await apiClient.get<UserInfoDetails>(
      userInfoEndpoints.byId(id),
      { headers: authHeaders(auth) },
    );
    return data;
  },
  async update(
    id: number,
    request: UpdateUserInfoRequest,
    auth: AuthorizedRequest,
  ): Promise<UpdateUserInfoResponse> {
    const { data } = await apiClient.patch<UpdateUserInfoResponse>(
      userInfoEndpoints.byId(id),
      request,
      { headers: authHeaders(auth) },
    );
    return data;
  },
  async remove(
    id: number,
    auth: AuthorizedRequest,
  ): Promise<DeleteUserInfoResponse> {
    const { data } = await apiClient.delete<DeleteUserInfoResponse>(
      userInfoEndpoints.byId(id),
      { headers: authHeaders(auth) },
    );
    return data;
  },
};
