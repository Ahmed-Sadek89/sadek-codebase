import { z } from "zod";
import type { CreateUserCompanyRequest } from "@repo/types/user-company";
import type { MessageKey } from "../../../i18n/types";
import { createUploadFieldSchema } from "../../ui/forms/base-upload/utils/schema";

type Translate = (
  key: MessageKey,
  values?: Record<string, string | number>,
) => string;

/** Backend limits (CreateUserCompanyDto). */
export const USER_COMPANY_NAME_MAX = 50;
export const USER_COMPANY_URL_MAX = 255;

/** Optional text: blank is "not set". */
const optionalTextSchema = (max?: number, maxMessage?: string) =>
  (max === undefined ? z.string().trim() : z.string().trim().max(max, maxMessage))
    .transform((value) => value || undefined);

/** A month picker value ("YYYY-MM") as the first day of that month in UTC. */
const toIsoMonthStart = (month: string) => `${month}-01T00:00:00.000Z`;

// The form keeps months as "YYYY-MM" and an "I still work here" switch; a
// valid submit sends ISO dates, and no `startWorkTo` while still working
// there. A picked logo is still a File here (see useUserCompanyForm).
export const createUserCompanySchema = (t: Translate) =>
  z
    .object({
      // One image (any format; ≤ 2 MB once compressed).
      logo: createUploadFieldSchema(t, { uploadType: "image" }),
      company_name: z
        .string()
        .trim()
        .min(1, t("userCompanyFormCompanyNameRequired"))
        .max(USER_COMPANY_NAME_MAX, t("userCompanyFormCompanyNameMax")),
      description_en: optionalTextSchema(),
      description_ar: optionalTextSchema(),
      startWorkFrom: z.string().min(1, t("userCompanyFormStartRequired")),
      isCurrent: z.boolean(),
      startWorkTo: z.string(),
      company_site: z
        .string()
        .trim()
        .max(USER_COMPANY_URL_MAX, t("projectFormUrlMax"))
        .refine(
          (value) => value === "" || z.url().safeParse(value).success,
          t("projectFormUrlInvalid"),
        )
        .transform((value) => value || undefined),
    })
    .superRefine(({ isCurrent, startWorkFrom, startWorkTo }, ctx) => {
      if (isCurrent) return;
      if (!startWorkTo) {
        ctx.addIssue({
          code: "custom",
          path: ["startWorkTo"],
          message: t("userCompanyFormEndRequired"),
        });
      } else if (startWorkFrom && startWorkTo < startWorkFrom) {
        // The backend answers an end before the start with 400.
        ctx.addIssue({
          code: "custom",
          path: ["startWorkTo"],
          message: t("userCompanyFormEndBeforeStart"),
        });
      }
    })
    .transform(
      ({ isCurrent, startWorkFrom, startWorkTo, ...rest }): UserCompanyFormValues => ({
        ...rest,
        startWorkFrom: toIsoMonthStart(startWorkFrom),
        startWorkTo: isCurrent ? undefined : toIsoMonthStart(startWorkTo),
      }),
    );

/** What a valid submit produces: the create request body, but the logo may
 * still be a File to upload. */
export type UserCompanyFormValues = Omit<CreateUserCompanyRequest, "logo"> & {
  logo?: string | File;
};

type UserCompanySchema = ReturnType<typeof createUserCompanySchema>;
/** What the form fields hold. */
export type UserCompanyFormInput = z.input<UserCompanySchema>;
