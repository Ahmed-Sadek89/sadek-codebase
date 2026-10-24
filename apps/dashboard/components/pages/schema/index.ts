import { z } from "zod";
import type { CreatePageRequest } from "@repo/types/pages";
import type { MessageKey } from "../../../i18n/types";

type Translate = (
  key: MessageKey,
  values?: Record<string, string | number>,
) => string;

/** Backend limit (CreatePageDto); both names are also unique (409 when taken). */
export const PAGE_NAME_MAX = 50;

const pageName = (t: Translate) =>
  z
    .string()
    .trim()
    .min(1, t("pageFormNameRequired"))
    .max(PAGE_NAME_MAX, t("pageFormNameMax", { max: PAGE_NAME_MAX }));

export const createPageSchema = (t: Translate) =>
  z.object({
    name_en: pageName(t),
    name_ar: pageName(t),
  }) satisfies z.ZodType<CreatePageRequest>;

type PageSchema = ReturnType<typeof createPageSchema>;
/** What the form fields hold. */
export type PageFormInput = z.input<PageSchema>;
/** What a valid submit produces (the create request body). */
export type PageFormValues = z.output<PageSchema>;
