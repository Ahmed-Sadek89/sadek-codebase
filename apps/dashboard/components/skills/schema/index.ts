import { z } from "zod";
import type { NamedRef } from "@repo/types/common";
import type { CreateSkillRequest } from "@repo/types/skills";
import type { MessageKey } from "../../../i18n/types";
import { createUploadFieldSchema } from "../../ui/forms/base-upload/utils/schema";

type Translate = (
  key: MessageKey,
  values?: Record<string, string | number>,
) => string;

export const SKILL_NAME_MAX = 50;

const namedRefSchema = z.object({
  id: z.number().int(),
  nameAr: z.string(),
  nameEn: z.string(),
}) satisfies z.ZodType<NamedRef>;

// The form keeps whole categories (for the chips' labels); a valid submit
// sends only their ids. A blank icon is sent as "not set"; a picked one is
// still a File here (see useSkillForm).
export const createSkillSchema = (t: Translate) =>
  z
    .object({
      nameEn: z
        .string()
        .trim()
        .min(1, t("skillFormNameEnRequired"))
        .max(SKILL_NAME_MAX, t("skillFormNameEnMax")),
      nameAr: z
        .string()
        .trim()
        .min(1, t("skillFormNameArRequired"))
        .max(SKILL_NAME_MAX, t("skillFormNameArMax")),
      // One image (any format, ≤ 2 MB).
      avatar_url: createUploadFieldSchema(t, { uploadType: "image" }),
      isActive: z.boolean(),
      categorySkills: z
        .array(namedRefSchema)
        .min(1, t("skillFormCategoriesRequired")),
    })
    .transform(
      ({ categorySkills, ...rest }): SkillFormValues => ({
        ...rest,
        categorySkillsIds: categorySkills.map((category) => category.id),
      }),
    );

/** What a valid submit produces: the create request body, but the icon may
 * still be a File to upload. */
export type SkillFormValues = Omit<CreateSkillRequest, "avatar_url"> & {
  avatar_url?: string | File;
};

type SkillSchema = ReturnType<typeof createSkillSchema>;
/** What the form fields hold. */
export type SkillFormInput = z.input<SkillSchema>;
