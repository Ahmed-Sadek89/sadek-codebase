import { z } from "zod";
import type { CreateCategorySkillRequest } from "@repo/types/category-skills";
import type { MessageKey } from "../../../i18n/types";

type Translate = (key: MessageKey) => string;

export const CATEGORY_SKILL_NAME_MAX = 50;
export const CATEGORY_SKILL_DESCRIPTION_MAX = 100;

// Descriptions are optional: a blank box is sent as "not set".
export const createCategorySkillSchema = (t: Translate) =>
  z.object({
    nameEn: z
      .string()
      .trim()
      .min(1, t("categorySkillFormNameEnRequired"))
      .max(CATEGORY_SKILL_NAME_MAX, t("categorySkillFormNameEnMax")),
    nameAr: z
      .string()
      .trim()
      .min(1, t("categorySkillFormNameArRequired"))
      .max(CATEGORY_SKILL_NAME_MAX, t("categorySkillFormNameArMax")),
    descriptionEn: z
      .string()
      .trim()
      .max(CATEGORY_SKILL_DESCRIPTION_MAX, t("categorySkillFormDescriptionEnMax"))
      .transform((value) => value || undefined),
    descriptionAr: z
      .string()
      .trim()
      .max(CATEGORY_SKILL_DESCRIPTION_MAX, t("categorySkillFormDescriptionArMax"))
      .transform((value) => value || undefined),
    isActive: z.boolean(),
  }) satisfies z.ZodType<CreateCategorySkillRequest>;

type CategorySkillSchema = ReturnType<typeof createCategorySkillSchema>;
/** What the form fields hold. */
export type CategorySkillFormInput = z.input<CategorySkillSchema>;
/** What a valid submit produces (the create request body). */
export type CategorySkillFormValues = z.output<CategorySkillSchema>;
