import type { MessageResponse } from "./auth";
import type { IsoDateString, PaginatedResponse, PaginationQuery } from "./common";
import type { SeoHreflang } from "@repo/constants/hreflang";
import type { TwitterCard } from "@repo/constants/twitter-card";
import type { PageRef } from "./pages";

/** Share card size for `twitter:card`; the values live in `@repo/constants/twitter-card`. */
export type { TwitterCard };

/** One language alternate: `{ lang: "en" | "ar" | "x-default" | …, url }`. */
export type { SeoHreflang };

/** One page's SEO row without its owner (GET /seo/:id and /seo/public/:pageId). */
export interface SeoDetails {
  id: number;
  /** The page (pages.id); unique: one SEO row per page. */
  pageId: number;
  page: PageRef;
  /** Max 70 characters. */
  metaTitle_en: string;
  /** Max 70 characters. */
  metaTitle_ar: string;
  /** Max 170 characters. */
  metaDescription_en: string;
  /** Max 170 characters. */
  metaDescription_ar: string;
  /** The page's preferred URL (http(s), max 255); null lets the website build it. */
  canonicalUrl: string | null;
  /** Language alternates; `[]` when none. At most 10, unique `lang`. */
  hreflang: SeoHreflang[];
  /** Comma-separated. */
  keywords_en: string | null;
  keywords_ar: string | null;
  /** Max 100 characters. */
  ogTitle_en: string | null;
  ogTitle_ar: string | null;
  /** Max 200 characters. */
  ogDescription_en: string | null;
  ogDescription_ar: string | null;
  /** http(s) URL, max 255 characters. */
  ogImage: string | null;
  /** Max 150 characters. */
  ogImageAlt_en: string | null;
  ogImageAlt_ar: string | null;
  twitterCard: TwitterCard;
  /** `@handle`, max 15 word characters after the optional `@`. */
  twitterHandle: string | null;
  /** Max 100 characters. */
  jobTitle_en: string | null;
  jobTitle_ar: string | null;
  robotsIndex: boolean;
  robotsFollow: boolean;
  /** The row the website uses; at most one per user. */
  isActive: boolean;
  createdAt: IsoDateString;
  updatedAt: IsoDateString;
}

/** An item of GET /seo. */
export interface Seo extends SeoDetails {
  user: { id: number };
}

/** POST /seo. `isActive` is not writable: a page's first row goes live; PATCH /seo/:id/toggle-active switches it. */
export interface CreateSeoRequest {
  /** One of the user's pages without SEO yet (404 if not theirs, 409 if taken). */
  pageId: number;
  metaTitle_en: string;
  metaTitle_ar: string;
  metaDescription_en: string;
  metaDescription_ar: string;
  canonicalUrl?: string;
  /** Default `[]`. Sending it replaces the whole list. */
  hreflang?: SeoHreflang[];
  keywords_en?: string;
  keywords_ar?: string;
  ogTitle_en?: string;
  ogTitle_ar?: string;
  ogDescription_en?: string;
  ogDescription_ar?: string;
  ogImage?: string;
  ogImageAlt_en?: string;
  ogImageAlt_ar?: string;
  /** Default `summary_large_image`. */
  twitterCard?: TwitterCard;
  twitterHandle?: string;
  jobTitle_en?: string;
  jobTitle_ar?: string;
  /** Default `true`. */
  robotsIndex?: boolean;
  /** Default `true`. */
  robotsFollow?: boolean;
}

/** Fields always present on a saved row. */
type SavedSeoField =
  | "id"
  | "pageId"
  | "metaTitle_en"
  | "metaTitle_ar"
  | "metaDescription_en"
  | "metaDescription_ar"
  | "isActive"
  | "user";

/** The saved entity; optional fields the client did not send may be missing. */
export type CreateSeoResponse = Pick<
  Seo,
  SavedSeoField
> &
  Partial<Omit<Seo, SavedSeoField>>;

/** GET /seo; `order` sorts by `createdAt` (default DESC). */
export interface SeoListQuery extends PaginationQuery {
  /** Matches metaTitle_en or metaTitle_ar (case-insensitive). Max 20 characters. */
  search?: string;
  isActive?: boolean;
  /** Only this page's row. (Not `page`: that is the pagination page.) */
  pageId?: number;
}

export type SeoListResponse = PaginatedResponse<Seo>;

type NullableCreateField = Exclude<
  keyof CreateSeoRequest,
  | "pageId"
  | "metaTitle_en"
  | "metaTitle_ar"
  | "metaDescription_en"
  | "metaDescription_ar"
  | "hreflang"
  | "twitterCard"
  | "robotsIndex"
  | "robotsFollow"
>;

/**
 * PATCH /seo/:id: any subset of the create fields; `null` clears an optional one.
 */
export type UpdateSeoRequest = Partial<
  Omit<CreateSeoRequest, NullableCreateField>
> & {
  [K in NullableCreateField]?: string | null;
};

export type UpdateSeoResponse = MessageResponse;

/** PATCH /seo/:id/toggle-active: the row's new `isActive`. */
export type ToggleSeoActiveResponse = MessageResponse & { isActive: boolean };

export type DeleteSeoResponse = MessageResponse;
