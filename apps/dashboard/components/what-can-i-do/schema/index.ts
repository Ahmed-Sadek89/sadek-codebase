import { z } from "zod";
import type { CreateWhatCanDoRequest } from "@repo/types/what-can-do";
import {
  WHAT_CAN_DO_RANK_MIN,
  WHAT_CAN_DO_SHORT_DESCRIPTION_MAX,
  WHAT_CAN_DO_TITLE_MAX,
} from "@repo/constants/what-can-do";
import type { MessageKey } from "../../../i18n/types";

type Translate = (
  key: MessageKey,
  values?: Record<string, string | number>,
) => string;

/** Backend limits (CreateWhatCanDoDto). */
export {
  WHAT_CAN_DO_RANK_MIN,
  WHAT_CAN_DO_SHORT_DESCRIPTION_MAX,
  WHAT_CAN_DO_TITLE_MAX,
};

/** Optional text: blank is "not set". */
const optionalTextSchema = (max?: number, maxMessage?: string) =>
  (max === undefined ? z.string().trim() : z.string().trim().max(max, maxMessage))
    .transform((value) => value || undefined);

// Rank is typed into a number input, so the form keeps it as text and a valid
// submit sends a whole number ≥ 0.
export const createWhatCanDoSchema = (t: Translate) =>
  z.object({
    title_en: z
      .string()
      .trim()
      .min(1, t("whatCanDoFormTitleEnRequired"))
      .max(WHAT_CAN_DO_TITLE_MAX, t("whatCanDoFormTitleEnMax", { max: WHAT_CAN_DO_TITLE_MAX })),
    title_ar: optionalTextSchema(
      WHAT_CAN_DO_TITLE_MAX,
      t("whatCanDoFormTitleArMax", { max: WHAT_CAN_DO_TITLE_MAX }),
    ),
    shortDescription_en: optionalTextSchema(
      WHAT_CAN_DO_SHORT_DESCRIPTION_MAX,
      t("whatCanDoFormShortDescriptionEnMax", { max: WHAT_CAN_DO_SHORT_DESCRIPTION_MAX }),
    ),
    shortDescription_ar: optionalTextSchema(
      WHAT_CAN_DO_SHORT_DESCRIPTION_MAX,
      t("whatCanDoFormShortDescriptionArMax", { max: WHAT_CAN_DO_SHORT_DESCRIPTION_MAX }),
    ),
    description_en: optionalTextSchema(),
    description_ar: optionalTextSchema(),
    rank: z
      .string()
      .trim()
      .min(1, t("whatCanDoFormRankRequired"))
      .regex(/^\d+$/, t("whatCanDoFormRankInvalid"))
      .transform(Number)
      .pipe(z.number().min(WHAT_CAN_DO_RANK_MIN, t("whatCanDoFormRankInvalid"))),
    isActive: z.boolean(),
  }) satisfies z.ZodType<CreateWhatCanDoRequest, unknown>;

/** What a valid submit produces: the create request body. */
export type WhatCanDoFormValues = CreateWhatCanDoRequest;

type WhatCanDoSchema = ReturnType<typeof createWhatCanDoSchema>;
/** What the form fields hold. */
export type WhatCanDoFormInput = z.input<WhatCanDoSchema>;
