import type { MessageKey } from "../../../../../i18n/types";
import type { UploadType } from "../../../../../libs/upload/upload-types";

/** next-intl's `t`, as passed to the schema factory. */
export type Translate = (
  key: MessageKey,
  values?: Record<string, string | number>,
) => string;

/**
 * What a BaseUpload field holds: the saved file's URL ("" when empty), the
 * File just picked, or several dropped Files (always invalid: one file per
 * field).
 */
export type UploadFieldValue = string | File | File[];

export type UploadFieldOptions = {
  uploadType?: UploadType;
  /** Largest file in bytes. */
  maxSize?: number;
};

export type BaseUploadProps = {
  label: string;
  /** RHF value: the saved URL ("" when empty), or the picked File(s). */
  value: UploadFieldValue;
  onChange: (value: UploadFieldValue) => void;
  onBlur?: () => void;
  /**
   * Runs the field's RHF validation, e.g. `() => form.trigger("avatar_url")`,
   * so a picked file's errors show right away. The File itself stays in RHF.
   */
  validate: () => Promise<boolean>;
  /** RHF's error for the field; the only message this component shows. */
  error?: string;
  /**
   * What the picker offers and the hint lists: "image", "document" (PDF/Word),
   * or "all" (default). Validation itself is the field's schema
   * (`createUploadFieldSchema` with the same uploadType).
   */
  uploadType?: UploadType;
  /** Shown in the hint; match the schema's maxSize. */
  maxSize?: number;
  disabled?: boolean;
  id?: string;
  containerClassName?: string;
};
