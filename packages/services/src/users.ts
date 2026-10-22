import { apiClient } from "@repo/libs/axios";
import type { AuthorizedRequest } from "@repo/types/auth";
import type {
  CreateUserRequest,
  CreateUserResponse,
  DeleteUserResponse,
  UpdateUserRequest,
  UpdateUserResponse,
  User,
  UserByEmailResponse,
  UsersQuery,
  UsersResponse,
} from "@repo/types/users";
import { authHeaders } from "./auth-headers";

export const usersEndpoints = {
  collection: "/users",
  byEmail: "/users/email",
  byId: (id: number) => `/users/${id}`,
} as const;

// Sign-up (POST /users) is public; every other users route sits behind JwtAuthGuard.
export const usersService = {
  async create(request: CreateUserRequest): Promise<CreateUserResponse> {
    const { data } = await apiClient.post<CreateUserResponse>(
      usersEndpoints.collection,
      request,
    );
    return data;
  },
  async findAll(
    query: UsersQuery,
    auth: AuthorizedRequest,
  ): Promise<UsersResponse> {
    const { data } = await apiClient.get<UsersResponse>(
      usersEndpoints.collection,
      { params: query, headers: authHeaders(auth) },
    );
    return data;
  },
  async findOneByEmail(
    email: string,
    auth: AuthorizedRequest,
  ): Promise<UserByEmailResponse> {
    const { data } = await apiClient.get<UserByEmailResponse | "">(
      usersEndpoints.byEmail,
      { params: { email }, headers: authHeaders(auth) },
    );
    // Nest sends an empty body for a `null` result.
    return data || null;
  },
  async findOne(id: number, auth: AuthorizedRequest): Promise<User> {
    const { data } = await apiClient.get<User>(usersEndpoints.byId(id), {
      headers: authHeaders(auth),
    });
    return data;
  },
  async update(
    id: number,
    request: UpdateUserRequest,
    auth: AuthorizedRequest,
  ): Promise<UpdateUserResponse> {
    const { data } = await apiClient.patch<UpdateUserResponse>(
      usersEndpoints.byId(id),
      request,
      { headers: authHeaders(auth) },
    );
    return data;
  },
  async remove(id: number, auth: AuthorizedRequest): Promise<DeleteUserResponse> {
    const { data } = await apiClient.delete<DeleteUserResponse>(
      usersEndpoints.byId(id),
      { headers: authHeaders(auth) },
    );
    return data;
  },
};
