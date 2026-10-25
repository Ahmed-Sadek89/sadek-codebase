import { z } from "zod";
import type { CreateCategoryProjectRequest } from "@repo/types/category-projects";
import type { MessageKey } from "../../../i18n/types";

type Translate = (key: MessageKey) => string;

export const CATEGORY_PROJECT_NAME_MAX = 50;
export const CATEGORY_PROJECT_DESCRIPTION_MAX = 255;

// Descriptions are optional: a blank box is sent as "not set".
export const createCategoryProjectSchema = (t: Translate) =>
  z.object({
    nameEn: z
      .string()
      .trim()
      .min(1, t("categoryProjectFormNameEnRequired"))
      .max(CATEGORY_PROJECT_NAME_MAX, t("categoryProjectFormNameEnMax")),
    nameAr: z
      .string()
      .trim()
      .min(1, t("categoryProjectFormNameArRequired"))
      .max(CATEGORY_PROJECT_NAME_MAX, t("categoryProjectFormNameArMax")),
    descriptionEn: z
      .string()
      .trim()
      .max(CATEGORY_PROJECT_DESCRIPTION_MAX, t("categoryProjectFormDescriptionEnMax"))
      .transform((value) => value || undefined),
    descriptionAr: z
      .string()
      .trim()
      .max(CATEGORY_PROJECT_DESCRIPTION_MAX, t("categoryProjectFormDescriptionArMax"))
      .transform((value) => value || undefined),
    isActive: z.boolean(),
  }) satisfies z.ZodType<CreateCategoryProjectRequest>;

type CategoryProjectSchema = ReturnType<typeof createCategoryProjectSchema>;
/** What the form fields hold. */
export type CategoryProjectFormInput = z.input<CategoryProjectSchema>;
/** What a valid submit produces (the create request body). */
export type CategoryProjectFormValues = z.output<CategoryProjectSchema>;
