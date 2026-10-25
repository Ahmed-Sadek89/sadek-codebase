import { apiClient } from "@repo/libs/axios";
import type { AuthorizedRequest } from "@repo/types/auth";
import type {
  CreateWhatCanDoRequest,
  CreateWhatCanDoResponse,
  DeleteWhatCanDoResponse,
  MyWhatCanDosResponse,
  ToggleWhatCanDoActiveResponse,
  UpdateWhatCanDoRequest,
  UpdateWhatCanDoResponse,
  WhatCanDoDetails,
  WhatCanDosQuery,
  WhatCanDosResponse,
} from "@repo/types/what-can-do";
import { authHeaders } from "./auth-headers";

export const whatCanDoEndpoints = {
  collection: "/what-can-do",
  public: "/what-can-do/public",
  me: "/what-can-do/me",
  byId: (id: number) => `/what-can-do/${id}`,
  toggleActive: (id: number) => `/what-can-do/${id}/toggle-active`,
} as const;

// GET /what-can-do/public is public; every other route sits behind JwtAuthGuard
// and only sees the signed-in user's items.
export const whatCanDoService = {
  async create(
    request: CreateWhatCanDoRequest,
    auth: AuthorizedRequest,
  ): Promise<CreateWhatCanDoResponse> {
    const { data } = await apiClient.post<CreateWhatCanDoResponse>(
      whatCanDoEndpoints.collection,
      request,
      { headers: authHeaders(auth) },
    );
    return data;
  },
  async findAll(
    query: WhatCanDosQuery,
    auth: AuthorizedRequest,
  ): Promise<WhatCanDosResponse> {
    const { data } = await apiClient.get<WhatCanDosResponse>(
      whatCanDoEndpoints.collection,
      { params: query, headers: authHeaders(auth) },
    );
    return data;
  },
  /** GET /what-can-do/public (no token): the default-view user's rows. */
  async findAllPublic(query: WhatCanDosQuery): Promise<WhatCanDosResponse> {
    const { data } = await apiClient.get<WhatCanDosResponse>(
      whatCanDoEndpoints.public,
      { params: query },
    );
    return data;
  },
  async findMine(
    query: WhatCanDosQuery,
    auth: AuthorizedRequest,
  ): Promise<MyWhatCanDosResponse> {
    const { data } = await apiClient.get<MyWhatCanDosResponse>(
      whatCanDoEndpoints.me,
      { params: query, headers: authHeaders(auth) },
    );
    return data;
  },
  async findOne(
    id: number,
    auth: AuthorizedRequest,
  ): Promise<WhatCanDoDetails> {
    const { data } = await apiClient.get<WhatCanDoDetails>(
      whatCanDoEndpoints.byId(id),
      { headers: authHeaders(auth) },
    );
    return data;
  },
  async update(
    id: number,
    request: UpdateWhatCanDoRequest,
    auth: AuthorizedRequest,
  ): Promise<UpdateWhatCanDoResponse> {
    const { data } = await apiClient.patch<UpdateWhatCanDoResponse>(
      whatCanDoEndpoints.byId(id),
      request,
      { headers: authHeaders(auth) },
    );
    return data;
  },
  /** Active ⇄ inactive. */
  async toggleActive(
    id: number,
    auth: AuthorizedRequest,
  ): Promise<ToggleWhatCanDoActiveResponse> {
    const { data } = await apiClient.patch<ToggleWhatCanDoActiveResponse>(
      whatCanDoEndpoints.toggleActive(id),
      undefined,
      { headers: authHeaders(auth) },
    );
    return data;
  },
  async remove(
    id: number,
    auth: AuthorizedRequest,
  ): Promise<DeleteWhatCanDoResponse> {
    const { data } = await apiClient.delete<DeleteWhatCanDoResponse>(
      whatCanDoEndpoints.byId(id),
      { headers: authHeaders(auth) },
    );
    return data;
  },
};
