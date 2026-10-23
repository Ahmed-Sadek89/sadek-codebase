import type { MessageResponse } from "./auth";
import type {
  IsoDateString,
  PaginatedResponse,
  PaginationQuery,
} from "./common";

/** A contact-form message, as returned by GET /contacts and GET /contacts/:id (no owner). */
export interface Contact {
  id: number;
  /** Max 255 characters. */
  name: string;
  /** Valid email, max 255 characters. */
  email: string;
  /** Max 255 characters. */
  subject: string;
  /** Max 5000 characters. */
  message: string;
  createdAt: IsoDateString;
}

/** POST /contacts (public): every field required and non-empty. */
export interface CreateContactRequest {
  /** Max 255 characters. */
  name: string;
  /** Valid email, max 255 characters. */
  email: string;
  /** Max 255 characters. */
  subject: string;
  /** Max 5000 characters. */
  message: string;
}

/** The saved message, addressed to the default-view user. */
export type CreateContactResponse = Contact & { user: { id: number } };

/** GET /contacts; `order` sorts by `createdAt` (default DESC, newest first). */
export interface ContactsQuery extends PaginationQuery {
  /** Matches the name, email, subject or message (case-insensitive). Max 50 characters. */
  search?: string;
}

/** The signed-in user's messages. */
export type ContactsResponse = PaginatedResponse<Contact>;

/** GET /contacts/:id: 404 unless the message belongs to the signed-in user. */
export type ContactDetails = Contact;

export type DeleteContactResponse = MessageResponse;
