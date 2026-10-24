"use client";

import { useTranslations } from "next-intl";
import { Button } from "@repo/ui/button";
import { RefreshCw, Trash2 } from "@repo/ui/icons";
import { cn } from "@repo/ui/utils";
import type { UploadFieldValue } from "../types/types";
import { UploadPreview } from "./upload-preview";

type UploadFileCardProps = {
  value: UploadFieldValue;
  label: string;
  previewSrc?: string | null;
  objectUrl?: string | null;
  isImage: boolean;
  displayName: string;
  /** The saved file's URL, shown as an "Open" link. */
  url?: string | null;
  hasError: boolean;
  disabled: boolean;
  onReplace: () => void;
  onRemove: () => void;
};

/** The chosen or saved file: thumbnail, name, Open link, Replace and Remove. */
export function UploadFileCard({
  value,
  label,
  previewSrc,
  objectUrl,
  isImage,
  displayName,
  url,
  hasError,
  disabled,
  onReplace,
  onRemove,
}: UploadFileCardProps) {
  const t = useTranslations();

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border p-3",
        hasError ? "border-danger/60 bg-danger/5" : "border-border bg-muted/30",
      )}
    >
      <UploadPreview
        previewSrc={previewSrc}
        objectUrl={objectUrl}
        isImage={isImage}
        alt={label}
      />
      <div className="min-w-0 flex-1">
        <p dir="ltr" className="truncate text-sm font-medium" title={displayName}>
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
          onClick={onReplace}
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
          onClick={onRemove}
          aria-label={t("uploadRemove")}
          title={t("uploadRemove")}
        >
          <Trash2 className="size-4" aria-hidden />
        </Button>
      </div>
    </div>
  );
}
