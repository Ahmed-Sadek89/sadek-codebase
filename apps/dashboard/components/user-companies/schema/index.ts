import { z } from "zod";
import {
  EMPLOYMENT_TYPES,
  LOCATION_TYPES,
  USER_COMPANY_JOB_TITLE_MAX,
  USER_COMPANY_LOCATION_MAX,
  USER_COMPANY_NAME_MAX,
} from "@repo/constants/user-company";
import { URL_MAX } from "@repo/constants/url";
import type { CreateUserCompanyRequest } from "@repo/types/user-company";
import type { MessageKey } from "../../../i18n/types";
import { isHttpUrl } from "../../../utils/validation";
import { createUploadFieldSchema } from "../../ui/forms/base-upload/utils/schema";

type Translate = (
  key: MessageKey,
  values?: Record<string, string | number>,
) => string;

export { URL_MAX, USER_COMPANY_NAME_MAX };

/** Optional text: blank is "not set". */
const optionalTextSchema = (max?: number, maxMessage?: string) =>
  (max === undefined ? z.string().trim() : z.string().trim().max(max, maxMessage))
    .transform((value) => value || undefined);

/** A select that starts blank ("") and must end on one of `values`. */
const requiredOptionSchema = <T extends string>(
  values: readonly T[],
  message: string,
) =>
  z
    .string()
    .refine((value) => (values as readonly string[]).includes(value), message)
    .transform((value) => value as T);

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
        .max(USER_COMPANY_NAME_MAX, t("userCompanyFormCompanyNameMax", { max: USER_COMPANY_NAME_MAX })),
      description_en: optionalTextSchema(),
      description_ar: optionalTextSchema(),
      startWorkFrom: z.string().min(1, t("userCompanyFormStartRequired")),
      isCurrent: z.boolean(),
      startWorkTo: z.string(),
      company_site: z
        .string()
        .trim()
        .max(URL_MAX, t("projectFormUrlMax", { max: URL_MAX }))
        .refine(
          (value) => value === "" || isHttpUrl(value),
          t("projectFormUrlInvalid"),
        )
        .transform((value) => value || undefined),
      job_title: z
        .string()
        .trim()
        .min(1, t("userCompanyFormJobTitleRequired"))
        .max(
          USER_COMPANY_JOB_TITLE_MAX,
          t("userCompanyFormJobTitleMax", { max: USER_COMPANY_JOB_TITLE_MAX }),
        ),
      location: z
        .string()
        .trim()
        .min(1, t("userCompanyFormLocationRequired"))
        .max(
          USER_COMPANY_LOCATION_MAX,
          t("userCompanyFormLocationMax", { max: USER_COMPANY_LOCATION_MAX }),
        ),
      location_type: requiredOptionSchema(
        LOCATION_TYPES,
        t("userCompanyFormLocationTypeRequired"),
      ),
      employment_type: requiredOptionSchema(
        EMPLOYMENT_TYPES,
        t("userCompanyFormEmploymentTypeRequired"),
      ),
      isActive: z.boolean(),
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
