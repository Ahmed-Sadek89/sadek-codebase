import { z } from "zod";
import type { NamedRef } from "@repo/types/common";
import type { CreateProjectRequest } from "@repo/types/projects";
import {
  PROJECT_NAME_MAX,
  PROJECT_RANK_MIN,
  PROJECT_SHORT_DESCRIPTION_MAX,
} from "@repo/constants/projects";
import { URL_MAX } from "@repo/constants/url";
import { isRichTextEmpty } from "@repo/rich-text";
import type { MessageKey } from "../../../i18n/types";
import { isHttpUrl } from "../../../utils/validation";
import { createUploadFieldSchema } from "../../ui/forms/base-upload/utils/schema";

type Translate = (
  key: MessageKey,
  values?: Record<string, string | number>,
) => string;

export { PROJECT_NAME_MAX, PROJECT_RANK_MIN, PROJECT_SHORT_DESCRIPTION_MAX, URL_MAX };

const namedRefSchema = z.object({
  id: z.number().int(),
  nameAr: z.string(),
  nameEn: z.string(),
}) satisfies z.ZodType<NamedRef>;

/** An optional link: blank is "not set", otherwise an http(s) URL of at most URL_MAX chars. */
const optionalUrlSchema = (t: Translate) =>
  z
    .string()
    .trim()
    .max(URL_MAX, t("projectFormUrlMax", { max: URL_MAX }))
    .refine(
      (value) => value === "" || isHttpUrl(value),
      t("projectFormUrlInvalid"),
    )
    .transform((value) => value || undefined);

// The form keeps whole categories (for the chips' labels); a valid submit
// sends only their ids. A blank image or link is sent as "not set"; a picked
// image is still a File here (see useProjectForm).
export const createProjectSchema = (t: Translate) =>
  z
    .object({
      nameEn: z
        .string()
        .trim()
        .min(1, t("projectFormNameEnRequired"))
        .max(PROJECT_NAME_MAX, t("projectFormNameEnMax", { max: PROJECT_NAME_MAX })),
      nameAr: z
        .string()
        .trim()
        .min(1, t("projectFormNameArRequired"))
        .max(PROJECT_NAME_MAX, t("projectFormNameArMax", { max: PROJECT_NAME_MAX })),
      shortDescriptionEn: z
        .string()
        .trim()
        .min(1, t("projectFormShortDescriptionEnRequired"))
        .max(PROJECT_SHORT_DESCRIPTION_MAX, t("projectFormShortDescriptionEnMax", { max: PROJECT_SHORT_DESCRIPTION_MAX })),
      shortDescriptionAr: z
        .string()
        .trim()
        .min(1, t("projectFormShortDescriptionArRequired"))
        .max(PROJECT_SHORT_DESCRIPTION_MAX, t("projectFormShortDescriptionArMax", { max: PROJECT_SHORT_DESCRIPTION_MAX })),
      // Rich-text HTML from the editor; the backend sanitizes it on save.
      descriptionEn: z
        .string()
        .refine((value) => !isRichTextEmpty(value), t("projectFormDescriptionEnRequired")),
      descriptionAr: z
        .string()
        .refine((value) => !isRichTextEmpty(value), t("projectFormDescriptionArRequired")),
      // One image (any format; ≤ 2 MB once compressed).
      mainImageUrl: createUploadFieldSchema(t, { uploadType: "image" }),
      liveUrl: optionalUrlSchema(t),
      repoUrl: optionalUrlSchema(t),
      // Typed into a number input, so the form keeps text; a valid submit sends
      // a whole number ≥ PROJECT_RANK_MIN.
      rank: z
        .string()
        .trim()
        .min(1, t("projectFormRankRequired"))
        .regex(/^\d+$/, t("projectFormRankInvalid"))
        .transform(Number)
        .pipe(z.number().min(PROJECT_RANK_MIN, t("projectFormRankInvalid"))),
      isActive: z.boolean(),
      categoryProjects: z
        .array(namedRefSchema)
        .min(1, t("projectFormCategoriesRequired")),
    })
    .transform(
      ({ categoryProjects, ...rest }): ProjectFormValues => ({
        ...rest,
        categoryProjectsIds: categoryProjects.map((category) => category.id),
      }),
    );

/** What a valid submit produces: the create request body, but the image may
 * still be a File to upload. */
export type ProjectFormValues = Omit<CreateProjectRequest, "mainImageUrl"> & {
  mainImageUrl?: string | File;
};

type ProjectSchema = ReturnType<typeof createProjectSchema>;
/** What the form fields hold. */
export type ProjectFormInput = z.input<ProjectSchema>;
