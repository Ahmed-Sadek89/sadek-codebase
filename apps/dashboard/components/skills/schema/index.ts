import { z } from "zod";
import type { NamedRef } from "@repo/types/common";
import type { CreateSkillRequest } from "@repo/types/skills";
import type { MessageKey } from "../../../i18n/types";

type Translate = (key: MessageKey) => string;

export const SKILL_NAME_MAX = 50;

const namedRefSchema = z.object({
  id: z.number().int(),
  nameAr: z.string(),
  nameEn: z.string(),
}) satisfies z.ZodType<NamedRef>;

// The form keeps whole categories (for the chips' labels); a valid submit
// sends only their ids. A blank avatar URL is sent as "not set".
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
      avatar_url: z
        .string()
        .trim()
        .refine(
          (value) => value === "" || z.url().safeParse(value).success,
          t("skillFormAvatarUrlInvalid"),
        )
        .transform((value) => value || undefined),
      isActive: z.boolean(),
      categorySkills: z
        .array(namedRefSchema)
        .min(1, t("skillFormCategoriesRequired")),
    })
    .transform(
      ({ categorySkills, ...rest }): CreateSkillRequest => ({
        ...rest,
        categorySkillsIds: categorySkills.map((category) => category.id),
      }),
    );

type SkillSchema = ReturnType<typeof createSkillSchema>;
/** What the form fields hold. */
export type SkillFormInput = z.input<SkillSchema>;
/** What a valid submit produces (the create request body). */
export type SkillFormValues = z.output<SkillSchema>;
