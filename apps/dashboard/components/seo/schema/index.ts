import { z } from "zod";
import type { CreateSeoRequest } from "@repo/types/seo";
import type { MessageKey } from "../../../i18n/types";
import { createUploadFieldSchema } from "../../ui/forms/base-upload/utils/schema";
import {
  HREFLANG_LANG_MAX,
  HREFLANG_MAX,
  HREFLANG_PATTERN,
  SEO_URL_MAX,
} from "@repo/constants/hreflang";
import {
  SEO_JOB_TITLE_MAX,
  SEO_META_DESCRIPTION_MAX,
  SEO_META_TITLE_MAX,
  SEO_OG_DESCRIPTION_MAX,
  SEO_OG_IMAGE_ALT_MAX,
  SEO_OG_TITLE_MAX,
  TWITTER_HANDLE_MAX,
  TWITTER_HANDLE_PATTERN,
} from "@repo/constants/seo";
import { TWITTER_CARDS } from "@repo/constants/twitter-card";
import { isHttpUrl } from "../../../utils/validation";

type Translate = (
  key: MessageKey,
  values?: Record<string, string | number>,
) => string;

export {
  HREFLANG_LANG_MAX,
  HREFLANG_MAX,
  SEO_JOB_TITLE_MAX,
  SEO_META_DESCRIPTION_MAX,
  SEO_META_TITLE_MAX,
  SEO_OG_DESCRIPTION_MAX,
  SEO_OG_IMAGE_ALT_MAX,
  SEO_OG_TITLE_MAX,
  SEO_URL_MAX,
  TWITTER_HANDLE_MAX,
};

const requiredText = (t: Translate, max: number) =>
  z
    .string()
    .trim()
    .min(1, t("seoFormRequired"))
    .max(max, t("seoFormMaxLength", { max }));

/** Blank is "not set". */
const optionalText = (t: Translate, max?: number) =>
  (max === undefined
    ? z.string().trim()
    : z.string().trim().max(max, t("seoFormMaxLength", { max }))
  ).transform((value) => value || undefined);

/** One alternate row: both cells are required once the row exists. */
const hreflangSchema = (t: Translate) =>
  z.object({
    lang: z
      .string()
      .trim()
      .min(1, t("seoFormRequired"))
      .max(HREFLANG_LANG_MAX, t("seoFormMaxLength", { max: HREFLANG_LANG_MAX }))
      .regex(HREFLANG_PATTERN, t("seoFormHreflangLangInvalid")),
    url: z
      .string()
      .trim()
      .min(1, t("seoFormRequired"))
      .max(SEO_URL_MAX, t("seoFormMaxLength", { max: SEO_URL_MAX }))
      .refine(isHttpUrl, t("seoFormUrlInvalid")),
  });

// A picked share image is still a File here (see useSeoForm).
export const createSeoSchema = (t: Translate) =>
  z.object({
    // The Select holds the id as text; the request body needs the number.
    pageId: z
      .string()
      .min(1, t("seoFormPageRequired"))
      .transform((value) => Number(value)),
    metaTitle_en: requiredText(t, SEO_META_TITLE_MAX),
    metaTitle_ar: requiredText(t, SEO_META_TITLE_MAX),
    metaDescription_en: requiredText(t, SEO_META_DESCRIPTION_MAX),
    metaDescription_ar: requiredText(t, SEO_META_DESCRIPTION_MAX),
    canonicalUrl: z
      .string()
      .trim()
      .max(SEO_URL_MAX, t("seoFormMaxLength", { max: SEO_URL_MAX }))
      .refine(
        (value) => value === "" || isHttpUrl(value),
        t("seoFormUrlInvalid"),
      )
      .transform((value) => value || undefined),
    hreflang: z
      .array(hreflangSchema(t))
      .max(HREFLANG_MAX, t("seoFormHreflangMax", { max: HREFLANG_MAX }))
      .superRefine((alternates, ctx) => {
        // Same rule as the backend's @ArrayUnique on `lang` (exact match).
        const seen = new Set<string>();
        alternates.forEach(({ lang }, index) => {
          const key = lang.trim();
          if (seen.has(key)) {
            ctx.addIssue({
              code: "custom",
              path: [index, "lang"],
              message: t("seoFormHreflangDuplicate"),
            });
          }
          seen.add(key);
        });
      }),
    keywords_en: optionalText(t),
    keywords_ar: optionalText(t),
    ogTitle_en: optionalText(t, SEO_OG_TITLE_MAX),
    ogTitle_ar: optionalText(t, SEO_OG_TITLE_MAX),
    ogDescription_en: optionalText(t, SEO_OG_DESCRIPTION_MAX),
    ogDescription_ar: optionalText(t, SEO_OG_DESCRIPTION_MAX),
    // One image (any format; ≤ 2 MB once compressed).
    ogImage: createUploadFieldSchema(t, { uploadType: "image" }),
    ogImageAlt_en: optionalText(t, SEO_OG_IMAGE_ALT_MAX),
    ogImageAlt_ar: optionalText(t, SEO_OG_IMAGE_ALT_MAX),
    twitterCard: z.enum(TWITTER_CARDS),
    twitterHandle: z
      .string()
      .trim()
      .refine(
        (value) => value === "" || TWITTER_HANDLE_PATTERN.test(value),
        t("seoFormTwitterHandleInvalid"),
      )
      .transform((value) => value || undefined),
    jobTitle_en: optionalText(t, SEO_JOB_TITLE_MAX),
    jobTitle_ar: optionalText(t, SEO_JOB_TITLE_MAX),
    robotsIndex: z.boolean(),
    robotsFollow: z.boolean(),
  }) satisfies z.ZodType<SeoFormValues>;

/** What a valid submit produces: the create request body, but the image may
 * still be a File to upload. */
export type SeoFormValues = Omit<CreateSeoRequest, "ogImage"> & {
  ogImage?: string | File;
};

type SeoSchema = ReturnType<typeof createSeoSchema>;
/** What the form fields hold. */
export type SeoFormInput = z.input<SeoSchema>;
