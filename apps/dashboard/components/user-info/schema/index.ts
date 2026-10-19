import { z } from "zod";
import type { CreateUserInfoRequest } from "@repo/types/user-info";
import type { MessageKey } from "../../../i18n/types";
import { createUploadFieldSchema } from "../../ui/forms/base-upload/utils/schema";
import { isGoogleDriveUrl } from "../utils/constants";

type Translate = (
  key: MessageKey,
  values?: Record<string, string | number>,
) => string;

/** Backend limits (CreateUserInfoDto). */
export const USER_INFO_HEAD_TITLE_MAX = 100;
export const USER_INFO_SHORT_DESCRIPTION_MAX = 255;
export const USER_INFO_LINK_MAX = 255;

const requiredText = (t: Translate, max?: number) => {
  const text = z.string().trim().min(1, t("userInfoFormRequired"));
  return max ? text.max(max, t("userInfoFormMax", { max })) : text;
};

/** Optional free text: blank is "not set". */
const optionalPlainText = (t: Translate, max?: number) => {
  const text = z.string().trim();
  return (max ? text.max(max, t("userInfoFormMax", { max })) : text).transform(
    (value) => value || undefined,
  );
};

/** A whole number of 0 or more; an empty number input arrives as NaN. */
const countSchema = (t: Translate) =>
  z
    .number({ error: t("userInfoFormCountInvalid") })
    .int(t("userInfoFormCountInvalid"))
    .min(0, t("userInfoFormCountInvalid"));

/** An optional field: blank is "not set", otherwise it must pass `isValid`. */
const optionalText = (
  t: Translate,
  isValid: (value: string) => boolean,
  invalidKey: MessageKey,
) =>
  z
    .string()
    .trim()
    .max(USER_INFO_LINK_MAX, t("userInfoFormMax", { max: USER_INFO_LINK_MAX }))
    .refine((value) => value === "" || isValid(value), t(invalidKey))
    .transform((value) => value || undefined);

// The backend only accepts http(s) links with a domain.
const isHttpUrl = (value: string) =>
  z.url({ protocol: /^https?$/, hostname: z.regexes.domain }).safeParse(value)
    .success;
const isEmail = (value: string) => z.email().safeParse(value).success;

/** Where the CV comes from: an uploaded file or a Google Drive share link. */
export const CV_SOURCES = ["upload", "link"] as const;
export type CvSource = (typeof CV_SOURCES)[number];

// A picked CV is still a File here; useUserInfoForm uploads it on submit.
// Only the active CV source is submitted, as `cv`.
export const createUserInfoSchema = (t: Translate) =>
  z
    .object({
      // English is required; Arabic is optional (falls back to English on display).
      headTitle_en: requiredText(t, USER_INFO_HEAD_TITLE_MAX),
      headTitle_ar: optionalPlainText(t, USER_INFO_HEAD_TITLE_MAX),
      shortDescription_en: requiredText(t, USER_INFO_SHORT_DESCRIPTION_MAX),
      shortDescription_ar: optionalPlainText(
        t,
        USER_INFO_SHORT_DESCRIPTION_MAX,
      ),
      description_en: requiredText(t),
      description_ar: optionalPlainText(t),
      yearsOfExp: countSchema(t),
      companies: countSchema(t),
      projectNumbers: countSchema(t),
      techMastering: countSchema(t),
      gmail: optionalText(t, isEmail, "userInfoFormEmailInvalid"),
      linkedin: optionalText(t, isHttpUrl, "userInfoFormUrlInvalid"),
      github: optionalText(t, isHttpUrl, "userInfoFormUrlInvalid"),
      cvSource: z.enum(CV_SOURCES),
      // One PDF/Word file, at most 2 MB.
      cv: createUploadFieldSchema(t, { uploadType: "document" }),
      // A Google Drive (or Docs) link; blank is "not set".
      cvLink: optionalText(t, isGoogleDriveUrl, "userInfoFormDriveInvalid"),
    })
    .transform(({ cvSource, cv, cvLink, ...rest }): UserInfoFormValues => ({
      ...rest,
      cv: cvSource === "link" ? cvLink : cv,
    }));

/** What a valid submit produces: the create body, but the CV may be a File. */
export type UserInfoFormValues = Omit<CreateUserInfoRequest, "cv"> & {
  cv?: string | File;
};

type UserInfoSchema = ReturnType<typeof createUserInfoSchema>;
/** What the form fields hold. */
export type UserInfoFormInput = z.input<UserInfoSchema>;
