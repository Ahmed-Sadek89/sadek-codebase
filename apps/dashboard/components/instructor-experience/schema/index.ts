import { z } from "zod";
import type { CreateInstructorExperienceRequest } from "@repo/types/instructor-experience";
import {
  INSTRUCTOR_EXPERIENCE_NAME_MAX,
  INSTRUCTOR_EXPERIENCE_PLATFORM_NAME_MAX,
  INSTRUCTOR_EXPERIENCE_RANK_MIN,
} from "@repo/constants/instructor-experience";
import { URL_MAX } from "@repo/constants/url";
import { isRichTextEmpty } from "@repo/rich-text";
import type { MessageKey } from "../../../i18n/types";
import { isHttpUrl } from "../../../utils/validation";
import { createUploadFieldSchema } from "../../ui/forms/base-upload/utils/schema";

type Translate = (
  key: MessageKey,
  values?: Record<string, string | number>,
) => string;

export {
  INSTRUCTOR_EXPERIENCE_NAME_MAX,
  INSTRUCTOR_EXPERIENCE_PLATFORM_NAME_MAX,
  INSTRUCTOR_EXPERIENCE_RANK_MIN,
  URL_MAX,
};

const skillSchema = z.object({ id: z.number().int(), name: z.string() });

/** A required http(s) link of at most URL_MAX characters. */
const urlSchema = (t: Translate) =>
  z
    .string()
    .trim()
    .min(1, t("instructorExperienceFormUrlRequired"))
    .max(URL_MAX, t("instructorExperienceFormUrlMax", { max: URL_MAX }))
    .refine(isHttpUrl, t("instructorExperienceFormUrlInvalid"));

/** A `YYYY-MM-DD` value from a date input. */
const dateSchema = (message: string) =>
  z.string().regex(/^\d{4}-\d{2}-\d{2}$/, message);

/** `YYYY-MM-DD` → the ISO date the backend expects (midnight UTC). */
export function toIsoDate(value: string): string {
  return `${value}T00:00:00.000Z`;
}

// Mirrors CreateInstructorExperienceDto. The form keeps whole skills (for the
// chips' labels) and sends only their ids; a picked cover photo is still a
// File here (see useInstructorExperienceForm).
export const createInstructorExperienceSchema = (t: Translate) =>
  z
    .object({
      name: z
        .string()
        .trim()
        .min(1, t("instructorExperienceFormNameRequired"))
        .max(
          INSTRUCTOR_EXPERIENCE_NAME_MAX,
          t("instructorExperienceFormNameMax", { max: INSTRUCTOR_EXPERIENCE_NAME_MAX }),
        ),
      courseLink: urlSchema(t),
      coverPhotoUrl: createUploadFieldSchema(t, { uploadType: "image" }),
      // Rich-text HTML from the editor; the backend sanitizes it on save.
      descriptionEn: z
        .string()
        .refine(
          (value) => !isRichTextEmpty(value),
          t("instructorExperienceFormDescriptionEnRequired"),
        ),
      descriptionAr: z
        .string()
        .refine(
          (value) => !isRichTextEmpty(value),
          t("instructorExperienceFormDescriptionArRequired"),
        ),
      startAt: dateSchema(t("instructorExperienceFormStartRequired")),
      endAt: dateSchema(t("instructorExperienceFormEndRequired")),
      coursePlatformName: z
        .string()
        .trim()
        .min(1, t("instructorExperienceFormPlatformNameRequired"))
        .max(
          INSTRUCTOR_EXPERIENCE_PLATFORM_NAME_MAX,
          t("instructorExperienceFormPlatformNameMax", {
            max: INSTRUCTOR_EXPERIENCE_PLATFORM_NAME_MAX,
          }),
        ),
      coursePlatformUrl: urlSchema(t),
      // Typed into a number input, so the form keeps text; a valid submit sends
      // a whole number ≥ INSTRUCTOR_EXPERIENCE_RANK_MIN.
      rank: z
        .string()
        .trim()
        .min(1, t("instructorExperienceFormRankRequired"))
        .regex(/^\d+$/, t("instructorExperienceFormRankInvalid"))
        .transform(Number)
        .pipe(
          z
            .number()
            .min(INSTRUCTOR_EXPERIENCE_RANK_MIN, t("instructorExperienceFormRankInvalid")),
        ),
      isActive: z.boolean(),
      skills: z.array(skillSchema).min(1, t("instructorExperienceFormSkillsRequired")),
    })
    // Same-format date strings compare correctly as text.
    .refine((values) => values.endAt >= values.startAt, {
      path: ["endAt"],
      message: t("instructorExperienceFormEndBeforeStart"),
    })
    .transform(
      ({ skills, startAt, endAt, ...rest }): InstructorExperienceFormValues => ({
        ...rest,
        startAt: toIsoDate(startAt),
        endAt: toIsoDate(endAt),
        skillsIds: skills.map((skill) => skill.id),
      }),
    );

/** What a valid submit produces: the create body, but the cover photo may still be a File to upload. */
export type InstructorExperienceFormValues = Omit<
  CreateInstructorExperienceRequest,
  "coverPhotoUrl"
> & {
  coverPhotoUrl?: string | File;
};

type InstructorExperienceSchema = ReturnType<typeof createInstructorExperienceSchema>;
/** What the form fields hold. */
export type InstructorExperienceFormInput = z.input<InstructorExperienceSchema>;
