"use client";

import { useRef, useState, type DragEvent } from "react";
import { isMediaUrl } from "../../../../../libs/media";
import type { UploadType } from "../../../../../libs/upload-types";
import type { UploadFieldValue } from "../types/types";
import { fileExtension, isImageUrl, urlFileName } from "../utils/file";
import { useObjectUrl } from "./use-object-url";

type UseBaseUploadOptions = {
  value: UploadFieldValue;
  onChange: (value: UploadFieldValue) => void;
  validate: () => Promise<boolean>;
  uploadType: UploadType;
  disabled: boolean;
};

/**
 * BaseUpload's state and handlers: picking, dropping, and removing files
 * (each handed to RHF and validated), plus what the preview shows.
 */
export function useBaseUpload({
  value,
  onChange,
  validate,
  uploadType,
  disabled,
}: UseBaseUploadOptions) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // What to preview: a picked File, or the saved URL.
  const file = value instanceof File ? value : null;
  const url = typeof value === "string" ? value : "";
  const objectUrl = useObjectUrl(file);

  const handleFiles = (files: FileList | null | undefined) => {
    if (!files || files.length === 0) return;
    // Hand the pick to RHF as-is; several files fail the schema's one-file rule.
    onChange(files.length > 1 ? Array.from(files) : files[0]!);
    void validate();
  };

  const handleRemove = () => {
    onChange("");
    void validate();
  };

  const openPicker = () => inputRef.current?.click();

  const onDragOver = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const onDragLeave = () => setIsDragging(false);

  const onDrop = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    setIsDragging(false);
    if (!disabled) handleFiles(event.dataTransfer.files);
  };

  // In image-only mode a URL is always an image, even without an extension
  // (e.g. https://picsum.photos/seed/x/128/128).
  const isImage = file
    ? file.type.startsWith("image/")
    : Boolean(url) && (uploadType === "image" || isImageUrl(url));

  const displayName = file ? file.name : urlFileName(url);

  return {
    inputRef,
    isDragging,
    file,
    url,
    objectUrl,
    hasValue: Boolean(file || url),
    previewSrc: objectUrl ?? (url && isMediaUrl(url) ? url : null),
    isImage,
    displayName,
    extension: fileExtension(displayName),
    handleFiles,
    handleRemove,
    openPicker,
    onDragOver,
    onDragLeave,
    onDrop,
  };
}
