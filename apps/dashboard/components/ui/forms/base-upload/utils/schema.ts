import { z } from "zod";
import {
  UPLOAD_MAX_SIZE,
  UPLOAD_TYPES_BY_KIND,
  uploadTypesLabel,
} from "../../../../../libs/upload-types";
import type { Translate, UploadFieldOptions } from "../types/types";
import { bytesToMb } from "./file";

/**
 * Zod schema for a BaseUpload field, so RHF owns every upload rule:
 * - One file only.
 * - A type allowed for `uploadType` (images, documents, or both).
 * - At most `maxSize` bytes.
 * - A stored value must be a URL.
 * Output: the picked File, the URL, or undefined when empty (a blank field
 * is "not set").
 */
export function createUploadFieldSchema(
  t: Translate,
  { uploadType = "all", maxSize = UPLOAD_MAX_SIZE }: UploadFieldOptions = {},
) {
  const accept = UPLOAD_TYPES_BY_KIND[uploadType];
  const isImageOnly = uploadType === "image";
  const sizeMb = bytesToMb(maxSize);

  return z
    .union([z.string(), z.instanceof(File), z.array(z.instanceof(File))])
    .superRefine((value, ctx) => {
      if (Array.isArray(value)) {
        ctx.addIssue({
          code: "custom",
          message: isImageOnly ? t("uploadOnlyOneImage") : t("uploadOnlyOne"),
        });
        return;
      }
      if (value instanceof File) {
        if (!accept.includes(value.type)) {
          ctx.addIssue({
            code: "custom",
            message: isImageOnly
              ? t("uploadImagesOnly")
              : t("uploadInvalidType", { types: uploadTypesLabel(accept) }),
          });
        } else if (value.size > maxSize) {
          ctx.addIssue({
            code: "custom",
            message: t("uploadTooLarge", { size: sizeMb }),
          });
        }
        return;
      }
      const url = value.trim();
      if (url && !z.url().safeParse(url).success) {
        ctx.addIssue({ code: "custom", message: t("uploadInvalidUrl") });
      }
    })
    // Arrays never get here (they fail the refine above).
    .transform((value): File | string | undefined =>
      value instanceof File
        ? value
        : typeof value === "string" && value.trim()
          ? value.trim()
          : undefined,
    );
}
