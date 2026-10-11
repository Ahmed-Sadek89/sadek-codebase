"use client";

import { useId } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Label } from "@repo/ui/label";
import { Button } from "@repo/ui/button";
import {
  CloudUpload,
  FileImage,
  FileText,
  RefreshCw,
  Trash2,
} from "@repo/ui/icons";
import { cn } from "@repo/ui/utils";
import {
  UPLOAD_MAX_SIZE,
  UPLOAD_TYPES_BY_KIND,
  uploadTypesLabel,
} from "../../../../libs/upload-types";
import { useBaseUpload } from "./hooks/use-base-upload";
import type { BaseUploadProps } from "./types/types";
import { bytesToMb } from "./utils/file";

export type { BaseUploadProps, UploadFieldValue } from "./types/types";
export { createUploadFieldSchema } from "./utils/schema";

export function BaseUpload({
  label,
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
  const FileIcon = isImage ? FileImage : FileText;

  const describedBy =
    [hintId, error ? errorId : undefined].filter(Boolean).join(" ") ||
    undefined;

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
        <div
          className={cn(
            "flex items-center gap-3 rounded-lg border p-3",
            error
              ? "border-danger/60 bg-danger/5"
              : "border-border bg-muted/30",
          )}
        >
          <span className="relative flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-background">
            {previewSrc && isImage ? (
              objectUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- local blob preview, not optimizable
                <img src={objectUrl} alt="" className="size-full object-cover" />
              ) : (
                <Image
                  src={previewSrc}
                  alt={label}
                  width={56}
                  height={56}
                  className="size-full object-cover"
                />
              )
            ) : (
              <FileIcon className="size-6 text-muted-foreground" aria-hidden />
            )}
          </span>
          <div className="min-w-0 flex-1">
            <p
              dir="ltr"
              className="truncate text-sm font-medium"
              title={displayName}
            >
              {Array.isArray(value)
                ? t("uploadFilesCount", { count: value.length })
                : displayName}
            </p>
            {url && (
              <a
                href={url}
                target="_blank"
                rel="noreferrer noopener"
                className="text-xs text-primary underline-offset-4 hover:underline"
              >
                {t("uploadOpen")}
              </a>
            )}
          </div>
          <div className="flex shrink-0 gap-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={disabled}
              onClick={openPicker}
              aria-label={t("uploadReplace")}
              title={t("uploadReplace")}
            >
              <RefreshCw className="size-4" aria-hidden />
              <span className="hidden sm:inline">{t("uploadReplace")}</span>
            </Button>
            <Button
              type="button"
              variant="outline-danger"
              size="sm"
              disabled={disabled}
              onClick={handleRemove}
              aria-label={t("uploadRemove")}
              title={t("uploadRemove")}
            >
              <Trash2 className="size-4" aria-hidden />
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={disabled}
          onClick={openPicker}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          aria-describedby={describedBy}
          className={cn(
            "flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-6 text-center transition-colors outline-none",
            "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50",
            isDragging
              ? "border-primary bg-primary/5"
              : error
                ? "border-danger/60 bg-danger/5"
                : "border-input bg-muted/20 hover:border-primary/60 hover:bg-muted/40",
            disabled && "cursor-not-allowed opacity-50",
          )}
        >
          <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <CloudUpload className="size-5" aria-hidden />
          </span>
          <span className="text-sm">
            <span className="font-medium text-primary">{t("uploadClick")}</span>{" "}
            <span className="text-muted-foreground">{t("uploadOrDrag")}</span>
          </span>
        </button>
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
