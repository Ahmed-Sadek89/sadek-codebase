"use client";

import { useId } from "react";
import { useTranslations } from "next-intl";
import { Label } from "@repo/ui/label";
import { cn } from "@repo/ui/utils";
import {
  UPLOAD_MAX_SIZE,
  UPLOAD_TYPES_BY_KIND,
  uploadTypesLabel,
} from "../../../../libs/upload/upload-types";
import { UploadDropzone } from "./components/upload-dropzone";
import { UploadFileCard } from "./components/upload-file-card";
import { useBaseUpload } from "./hooks/use-base-upload";
import type { BaseUploadProps } from "./types/types";
import { bytesToMb } from "./utils/file";

export type { BaseUploadProps, UploadFieldValue } from "./types/types";
export { createUploadFieldSchema } from "./utils/schema";

export function BaseUpload({
  label,
  description,
  value,
  onChange,
  onBlur,
  validate,
  error,
  uploadType = "all",
  maxSize = UPLOAD_MAX_SIZE,
  disabled = false,
  id,
  containerClassName,
}: BaseUploadProps) {
  const t = useTranslations();
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;
  const accept = UPLOAD_TYPES_BY_KIND[uploadType];
  const maxSizeMb = bytesToMb(maxSize);
  const {
    inputRef,
    isDragging,
    url,
    objectUrl,
    hasValue,
    previewSrc,
    isImage,
    displayName,
    handleFiles,
    handleRemove,
    openPicker,
    onDragOver,
    onDragLeave,
    onDrop,
  } = useBaseUpload({ value, onChange, validate, uploadType, disabled });

  const descriptionId = `${inputId}-description`;
  const describedBy =
    [description ? descriptionId : undefined, hintId, error ? errorId : undefined]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <div className={cn("flex flex-col gap-y-2", containerClassName)}>
      <Label htmlFor={inputId}>{label}</Label>
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={accept.join(",")}
        disabled={disabled}
        aria-describedby={describedBy}
        aria-invalid={error ? true : undefined}
        className="sr-only"
        onBlur={onBlur}
        onChange={(event) => {
          handleFiles(event.target.files);
          // Allow picking the same file again after removing it.
          event.target.value = "";
        }}
      />

      {hasValue ? (
        <UploadFileCard
          value={value}
          label={label}
          previewSrc={previewSrc}
          objectUrl={objectUrl}
          isImage={isImage}
          displayName={displayName}
          url={url}
          hasError={Boolean(error)}
          disabled={disabled}
          onReplace={openPicker}
          onRemove={handleRemove}
        />
      ) : (
        <UploadDropzone
          isDragging={isDragging}
          hasError={Boolean(error)}
          disabled={disabled}
          describedBy={describedBy}
          onClick={openPicker}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        />
      )}

      {description && (
        <div id={descriptionId} className="text-xs text-muted-foreground">
          {description}
        </div>
      )}
      <p id={hintId} className="text-xs text-muted-foreground">
        {t("uploadHint", { types: uploadTypesLabel(accept), size: maxSizeMb })}
      </p>
      {error && (
        <p id={errorId} role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
