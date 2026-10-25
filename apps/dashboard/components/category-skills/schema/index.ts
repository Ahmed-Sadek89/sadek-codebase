import { z } from "zod";
import type { CreateCategorySkillRequest } from "@repo/types/category-skills";
import type { MessageKey } from "../../../i18n/types";
import {
  CATEGORY_SKILL_DESCRIPTION_MAX,
  CATEGORY_SKILL_NAME_MAX,
  CATEGORY_SKILL_RANK_MIN,
} from "@repo/constants/category-skills";

type Translate = (
  key: MessageKey,
  values?: Record<string, string | number>,
) => string;

export {
  CATEGORY_SKILL_DESCRIPTION_MAX,
  CATEGORY_SKILL_NAME_MAX,
  CATEGORY_SKILL_RANK_MIN,
};

// Descriptions are optional: a blank box is sent as "not set".
export const createCategorySkillSchema = (t: Translate) =>
  z.object({
    nameEn: z
      .string()
      .trim()
      .min(1, t("categorySkillFormNameEnRequired"))
      .max(CATEGORY_SKILL_NAME_MAX, t("categorySkillFormNameEnMax", { max: CATEGORY_SKILL_NAME_MAX })),
    nameAr: z
      .string()
      .trim()
      .min(1, t("categorySkillFormNameArRequired"))
      .max(CATEGORY_SKILL_NAME_MAX, t("categorySkillFormNameArMax", { max: CATEGORY_SKILL_NAME_MAX })),
    descriptionEn: z
      .string()
      .trim()
      .max(CATEGORY_SKILL_DESCRIPTION_MAX, t("categorySkillFormDescriptionEnMax", { max: CATEGORY_SKILL_DESCRIPTION_MAX }))
      .transform((value) => value || undefined),
    descriptionAr: z
      .string()
      .trim()
      .max(CATEGORY_SKILL_DESCRIPTION_MAX, t("categorySkillFormDescriptionArMax", { max: CATEGORY_SKILL_DESCRIPTION_MAX }))
      .transform((value) => value || undefined),
    // Typed into a number input, so the form keeps text; a valid submit sends
    // a whole number ≥ CATEGORY_SKILL_RANK_MIN.
    rank: z
      .string()
      .trim()
      .min(1, t("categorySkillFormRankRequired"))
      .regex(/^\d+$/, t("categorySkillFormRankInvalid"))
      .transform(Number)
      .pipe(z.number().min(CATEGORY_SKILL_RANK_MIN, t("categorySkillFormRankInvalid"))),
    isActive: z.boolean(),
  }) satisfies z.ZodType<CreateCategorySkillRequest>;

type CategorySkillSchema = ReturnType<typeof createCategorySkillSchema>;
/** What the form fields hold. */
export type CategorySkillFormInput = z.input<CategorySkillSchema>;
/** What a valid submit produces (the create request body). */
export type CategorySkillFormValues = z.output<CategorySkillSchema>;
