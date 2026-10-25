import { z } from "zod";
import type { CreateCategoryProjectRequest } from "@repo/types/category-projects";
import type { MessageKey } from "../../../i18n/types";
import {
  CATEGORY_PROJECT_NAME_MAX,
  CATEGORY_PROJECT_RANK_MIN,
} from "@repo/constants/category-projects";

type Translate = (
  key: MessageKey,
  values?: Record<string, string | number>,
) => string;

export { CATEGORY_PROJECT_NAME_MAX, CATEGORY_PROJECT_RANK_MIN };

export const createCategoryProjectSchema = (t: Translate) =>
  z.object({
    nameEn: z
      .string()
      .trim()
      .min(1, t("categoryProjectFormNameEnRequired"))
      .max(CATEGORY_PROJECT_NAME_MAX, t("categoryProjectFormNameEnMax", { max: CATEGORY_PROJECT_NAME_MAX })),
    nameAr: z
      .string()
      .trim()
      .min(1, t("categoryProjectFormNameArRequired"))
      .max(CATEGORY_PROJECT_NAME_MAX, t("categoryProjectFormNameArMax", { max: CATEGORY_PROJECT_NAME_MAX })),
    // Typed into a number input, so the form keeps text; a valid submit sends
    // a whole number ≥ CATEGORY_PROJECT_RANK_MIN.
    rank: z
      .string()
      .trim()
      .min(1, t("categoryProjectFormRankRequired"))
      .regex(/^\d+$/, t("categoryProjectFormRankInvalid"))
      .transform(Number)
      .pipe(z.number().min(CATEGORY_PROJECT_RANK_MIN, t("categoryProjectFormRankInvalid"))),
    isActive: z.boolean(),
  }) satisfies z.ZodType<CreateCategoryProjectRequest>;

type CategoryProjectSchema = ReturnType<typeof createCategoryProjectSchema>;
/** What the form fields hold. */
export type CategoryProjectFormInput = z.input<CategoryProjectSchema>;
/** What a valid submit produces (the create request body). */
export type CategoryProjectFormValues = z.output<CategoryProjectSchema>;
