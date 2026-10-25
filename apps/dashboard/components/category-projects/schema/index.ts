import { z } from "zod";
import type { CreateCategoryProjectRequest } from "@repo/types/category-projects";
import type { MessageKey } from "../../../i18n/types";
import {
  CATEGORY_PROJECT_DESCRIPTION_MAX,
  CATEGORY_PROJECT_NAME_MAX,
} from "@repo/constants/category-projects";

type Translate = (
  key: MessageKey,
  values?: Record<string, string | number>,
) => string;

export { CATEGORY_PROJECT_DESCRIPTION_MAX, CATEGORY_PROJECT_NAME_MAX };

// Descriptions are optional: a blank box is sent as "not set".
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
    descriptionEn: z
      .string()
      .trim()
      .max(CATEGORY_PROJECT_DESCRIPTION_MAX, t("categoryProjectFormDescriptionEnMax", { max: CATEGORY_PROJECT_DESCRIPTION_MAX }))
      .transform((value) => value || undefined),
    descriptionAr: z
      .string()
      .trim()
      .max(CATEGORY_PROJECT_DESCRIPTION_MAX, t("categoryProjectFormDescriptionArMax", { max: CATEGORY_PROJECT_DESCRIPTION_MAX }))
      .transform((value) => value || undefined),
    isActive: z.boolean(),
  }) satisfies z.ZodType<CreateCategoryProjectRequest>;

type CategoryProjectSchema = ReturnType<typeof createCategoryProjectSchema>;
/** What the form fields hold. */
export type CategoryProjectFormInput = z.input<CategoryProjectSchema>;
/** What a valid submit produces (the create request body). */
export type CategoryProjectFormValues = z.output<CategoryProjectSchema>;
