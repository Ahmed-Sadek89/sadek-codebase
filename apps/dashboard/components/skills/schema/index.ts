import { z } from "zod";
import type { NamedRef } from "@repo/types/common";
import type { CreateManySkillsRequest } from "@repo/types/skills";
import type { MessageKey } from "../../../i18n/types";

type Translate = (
  key: MessageKey,
  values?: Record<string, string | number>,
) => string;

export const SKILL_NAME_MAX = 50;
/** Max names in one create (POST /skills/bulk accepts up to 50). */
export const SKILLS_BULK_MAX = 50;

const namedRefSchema = z.object({
  id: z.number().int(),
  nameAr: z.string(),
  nameEn: z.string(),
}) satisfies z.ZodType<NamedRef>;

// Names are rows of `{ value }` because useFieldArray needs objects. The form
// keeps whole categories (for the chips' labels); a valid submit sends only
// their ids. Creating sends every name to POST /skills/bulk; editing has one
// row and sends it as `name` (see useSkillForm).
export const createSkillSchema = (t: Translate) =>
  z
    .object({
      names: z
        .array(
          z.object({
            value: z
              .string()
              .trim()
              .min(1, t("skillFormNameRequired"))
              .max(SKILL_NAME_MAX, t("skillFormNameMax")),
          }),
        )
        .min(1, t("skillFormNameRequired"))
        .max(SKILLS_BULK_MAX, t("skillFormNamesMax", { max: SKILLS_BULK_MAX }))
        .superRefine((names, ctx) => {
          // Marks every repeat after the first, ignoring case (like the backend).
          const seen = new Set<string>();
          names.forEach(({ value }, index) => {
            const key = value.toLowerCase();
            if (key && seen.has(key)) {
              ctx.addIssue({
                code: "custom",
                path: [index, "value"],
                message: t("skillFormNameDuplicate"),
              });
            }
            seen.add(key);
          });
        }),
      isActive: z.boolean(),
      categorySkills: z
        .array(namedRefSchema)
        .min(1, t("skillFormCategoriesRequired")),
    })
    .transform(
      ({ names, categorySkills, ...rest }): SkillFormValues => ({
        ...rest,
        names: names.map(({ value }) => value),
        categorySkillsIds: categorySkills.map((category) => category.id),
      }),
    );

/** What a valid submit produces (the POST /skills/bulk body). */
export type SkillFormValues = CreateManySkillsRequest;

type SkillSchema = ReturnType<typeof createSkillSchema>;
/** What the form fields hold. */
export type SkillFormInput = z.input<SkillSchema>;
