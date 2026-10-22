import type { MessageResponse } from "./auth";
import type {
  IsoDateString,
  PaginatedResponse,
  PaginationQuery,
} from "./common";

/** A user row (GET /users, GET /users/:id, GET /auth/me). Never includes the password. */
export interface User {
  id: number;
  /** Unique. 3–50 characters. */
  username: string;
  /** Unique. Max 70 characters. */
  email: string;
  avatarUrl: string | null;
  coverPhotoUrl: string | null;
  createdAt: IsoDateString;
  lastLoginAt: IsoDateString | null;
  lastLogoutAt: IsoDateString | null;
  /** At most one user is the default view; `false` by default. */
  isDefaultView: boolean;
}

/** POST /users (public). */
export interface CreateUserRequest {
  /** 3–50 characters, unique. */
  username: string;
  /** A valid email, unique. Max 70 characters (database column). */
  email: string;
  /** 8–32 characters with lowercase, uppercase, a digit, and one of `@$!%*?&`. */
  password: string;
  /** Must equal `password`. */
  confirmPassword: string;
  /** An http(s) URL with a TLD. Max 255 characters. */
  avatarUrl?: string;
  /** An http(s) URL with a TLD. Max 255 characters. */
  coverPhotoUrl?: string;
}

export type CreateUserResponse = MessageResponse;

/** GET /users; `order` sorts by `createdAt` (default DESC, newest first). */
export interface UsersQuery extends PaginationQuery {
  /** Matches username or email (case-insensitive). Max 20 characters. */
  search?: string;
  /** Exact avatar URL match. */
  avatarUrl?: string;
  /** Only the default-view user (`true`) or everyone else (`false`). */
  isDefaultView?: boolean;
}

export type UsersResponse = PaginatedResponse<User>;

/**
 * GET /users/email?email=: the sign-in lookup row, or `null` when no user has
 * that email. `password` is the stored bcrypt hash.
 */
export interface UserByEmail {
  id: number;
  username: string;
  email: string;
  password: string;
  avatarUrl: string | null;
  isDefaultView: boolean;
}

export type UserByEmailResponse = UserByEmail | null;

/**
 * PATCH /users/:id: any subset of the profile fields. `null` clears an image
 * (omitting it keeps the current one). Passwords cannot be changed here; use
 * PATCH /auth/change-password.
 */
export type UpdateUserRequest = Partial<
  Pick<CreateUserRequest, "username" | "email">
> & {
  avatarUrl?: string | null;
  coverPhotoUrl?: string | null;
};

export type UpdateUserResponse = MessageResponse;

export type DeleteUserResponse = MessageResponse;

/**
 * PATCH /users/:id/default-view: `true` makes this the only default-view user
 * (the current one is set to `false`); `false` just clears it on this user.
 */
export interface UpdateUserDefaultViewRequest {
  isDefaultView: boolean;
}

export type UpdateUserDefaultViewResponse = MessageResponse;
