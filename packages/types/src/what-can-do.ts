import type { MessageResponse } from "./auth";
import type {
  IsoDateString,
  PaginatedResponse,
  PaginationQuery,
} from "./common";

/** GET /what-can-do/:id and the items of GET /what-can-do/me (no owner). */
export interface WhatCanDoDetails {
  id: number;
  /** Max 50 characters each. English is always set; Arabic is `null` until added. */
  title_en: string;
  title_ar: string | null;
  /** Max 100 characters each. */
  shortDescription_en: string | null;
  shortDescription_ar: string | null;
  description_en: string | null;
  description_ar: string | null;
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
  /** Max 50 characters each. English is required, Arabic optional. */
  title_en: string;
  title_ar?: string;
  /** Max 100 characters each. */
  shortDescription_en?: string;
  shortDescription_ar?: string;
  description_en?: string;
  description_ar?: string;
  /** Integer, 0 or more. Not unique: equal ranks are ordered by id. */
  rank: number;
}

/** Optional fields: omitted from a create response when not sent, cleared with `null` on update. */
type OptionalWhatCanDoField =
  | "title_ar"
  | "shortDescription_en"
  | "shortDescription_ar"
  | "description_en"
  | "description_ar";

type OptionalWhatCanDoFields = {
  [Field in OptionalWhatCanDoField]?: string | null;
};

/** The saved row; optional fields are omitted when not sent. */
export type CreateWhatCanDoResponse = Omit<WhatCanDo, OptionalWhatCanDoField> &
  OptionalWhatCanDoFields;

/**
 * GET /what-can-do, GET /what-can-do/public and GET /what-can-do/me (`FilterWhatCanDoDto`).
 * `order` sorts the two lists by `createdAt` (default DESC) and `/me` by `rank`
 * (default ASC; ties by `id`).
 */
export interface WhatCanDosQuery extends PaginationQuery {
  /** Matches the English or Arabic title, shortDescription or description (case-insensitive). Max 20 characters. */
  search?: string;
}

export type WhatCanDosResponse = PaginatedResponse<WhatCanDo>;

/** GET /what-can-do/me: the signed-in user's items. */
export type MyWhatCanDosResponse = PaginatedResponse<WhatCanDoDetails>;

/**
 * PATCH /what-can-do/:id: any subset of the create fields. `null` clears an
 * optional text, e.g. an Arabic title (omitting it keeps the current one).
 */
export type UpdateWhatCanDoRequest = Partial<
  Omit<CreateWhatCanDoRequest, OptionalWhatCanDoField>
> &
  OptionalWhatCanDoFields;

export type UpdateWhatCanDoResponse = MessageResponse;

export type DeleteWhatCanDoResponse = MessageResponse;
