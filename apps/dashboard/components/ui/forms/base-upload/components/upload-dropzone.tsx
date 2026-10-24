"use client";

import type { DragEvent } from "react";
import { useTranslations } from "next-intl";
import { CloudUpload } from "@repo/ui/icons";
import { cn } from "@repo/ui/utils";

type UploadDropzoneProps = {
  isDragging: boolean;
  hasError: boolean;
  disabled: boolean;
  /** The hint and error ids, so the button announces them too. */
  describedBy?: string;
  onClick: () => void;
  onDragOver: (event: DragEvent<HTMLElement>) => void;
  onDragLeave: () => void;
  onDrop: (event: DragEvent<HTMLElement>) => void;
};

/** The empty state: a dashed button that opens the picker or takes a dropped file. */
export function UploadDropzone({
  isDragging,
  hasError,
  disabled,
  describedBy,
  onClick,
  onDragOver,
  onDragLeave,
  onDrop,
}: UploadDropzoneProps) {
  const t = useTranslations();

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      aria-describedby={describedBy}
      className={cn(
        "flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-6 text-center transition-colors outline-none",
        "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50",
        isDragging
          ? "border-primary bg-primary/5"
          : hasError
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
  );
}
