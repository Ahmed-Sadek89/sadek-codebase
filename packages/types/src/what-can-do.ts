import type { MessageResponse } from "./auth";
import type {
  IsoDateString,
  PaginatedResponse,
  PaginationQuery,
} from "./common";

/** GET /what-can-do/:id and the items of GET /what-can-do/me (no owner). */
export interface WhatCanDoDetails {
  id: number;
  /** Max 50 characters. */
  title: string;
  /** Max 100 characters. */
  shortDescription: string | null;
  description: string | null;
  /** Display order, set by the client. */
  rank: number;
  createdAt: IsoDateString;
}

/** An item of GET /what-can-do: includes the owner as `user: { id }`. */
export interface WhatCanDo extends WhatCanDoDetails {
  user: { id: number };
}

/** POST /what-can-do */
export interface CreateWhatCanDoRequest {
  /** Max 50 characters. */
  title: string;
  /** Max 100 characters. */
  shortDescription?: string;
  description?: string;
  /** Integer, 0 or more. Not unique: equal ranks are ordered by id. */
  rank: number;
}

/** The saved row; optional fields are omitted when not sent. */
export type CreateWhatCanDoResponse = Omit<
  WhatCanDo,
  "shortDescription" | "description"
> & {
  shortDescription?: string | null;
  description?: string | null;
};

/**
 * GET /what-can-do and GET /what-can-do/me (`FilterWhatCanDoDto`). `order` sorts the
 * list by `createdAt` (default DESC) and `/me` by `rank` (default ASC; ties by `id`).
 */
export interface WhatCanDosQuery extends PaginationQuery {
  /** Matches title, shortDescription or description (case-insensitive). Max 20 characters. */
  search?: string;
}

export type WhatCanDosResponse = PaginatedResponse<WhatCanDo>;

/** GET /what-can-do/me: the signed-in user's items. */
export type MyWhatCanDosResponse = PaginatedResponse<WhatCanDoDetails>;

/**
 * PATCH /what-can-do/:id: any subset of the create fields. `null` clears an
 * optional text (omitting it keeps the current one).
 */
export type UpdateWhatCanDoRequest = Partial<
  Omit<CreateWhatCanDoRequest, "shortDescription" | "description">
> & {
  shortDescription?: string | null;
  description?: string | null;
};

export type UpdateWhatCanDoResponse = MessageResponse;

export type DeleteWhatCanDoResponse = MessageResponse;
