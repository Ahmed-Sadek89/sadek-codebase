import { z } from "zod";
import type { MessageKey } from "../../../i18n/types";
import { createUploadFieldSchema } from "../../ui/forms/base-upload/utils/schema";

type Translate = (
  key: MessageKey,
  values?: Record<string, string | number>,
) => string;

/** Backend limits (CreateUserDto and the users entity). */
export const PROFILE_USERNAME_MIN = 3;
export const PROFILE_USERNAME_MAX = 50;
export const PROFILE_EMAIL_MAX = 70;

// A picked avatar or cover is still a File here; nothing is uploaded yet.
export const createProfileSchema = (t: Translate) =>
  z.object({
    username: z
      .string()
      .trim()
      .min(1, t("profileFormRequired"))
      .min(
        PROFILE_USERNAME_MIN,
        t("profileFormMin", { min: PROFILE_USERNAME_MIN }),
      )
      .max(
        PROFILE_USERNAME_MAX,
        t("profileFormMax", { max: PROFILE_USERNAME_MAX }),
      ),
    email: z
      .string()
      .trim()
      .min(1, t("profileFormRequired"))
      .max(PROFILE_EMAIL_MAX, t("profileFormMax", { max: PROFILE_EMAIL_MAX }))
      .pipe(z.email(t("profileFormEmailInvalid"))),
    avatarUrl: createUploadFieldSchema(t, { uploadType: "image" }),
    coverPhotoUrl: createUploadFieldSchema(t, { uploadType: "image" }),
  });

type ProfileSchema = ReturnType<typeof createProfileSchema>;
/** What the form fields hold. */
export type ProfileFormInput = z.input<ProfileSchema>;
/** What a valid submit produces; images may be a picked File. */
export type ProfileFormValues = z.output<ProfileSchema>;
