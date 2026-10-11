import { z } from "zod";
import type { NamedRef } from "@repo/types/common";
import type { CreateProjectRequest } from "@repo/types/projects";
import type { MessageKey } from "../../../i18n/types";
import { createUploadFieldSchema } from "../../ui/forms/base-upload/utils/schema";

type Translate = (
  key: MessageKey,
  values?: Record<string, string | number>,
) => string;

/** Backend limits (CreateProjectDto). */
export const PROJECT_NAME_MAX = 100;
export const PROJECT_URL_MAX = 255;

const namedRefSchema = z.object({
  id: z.number().int(),
  nameAr: z.string(),
  nameEn: z.string(),
}) satisfies z.ZodType<NamedRef>;

/** An optional link: blank is "not set", otherwise a URL of at most 255 chars. */
const optionalUrlSchema = (t: Translate) =>
  z
    .string()
    .trim()
    .max(PROJECT_URL_MAX, t("projectFormUrlMax"))
    .refine(
      (value) => value === "" || z.url().safeParse(value).success,
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
        .max(PROJECT_NAME_MAX, t("projectFormNameEnMax")),
      nameAr: z
        .string()
        .trim()
        .min(1, t("projectFormNameArRequired"))
        .max(PROJECT_NAME_MAX, t("projectFormNameArMax")),
      descriptionEn: z
        .string()
        .trim()
        .min(1, t("projectFormDescriptionEnRequired")),
      descriptionAr: z
        .string()
        .trim()
        .min(1, t("projectFormDescriptionArRequired")),
      // One image (any format; ≤ 2 MB once compressed).
      mainImageUrl: createUploadFieldSchema(t, { uploadType: "image" }),
      liveUrl: optionalUrlSchema(t),
      repoUrl: optionalUrlSchema(t),
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
