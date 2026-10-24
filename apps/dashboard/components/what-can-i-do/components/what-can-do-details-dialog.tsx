"use client";

import type { ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { WhatCanDoDetails } from "@repo/types/what-can-do";
import { Sparkles } from "@repo/ui/icons";
import { AppDialog } from "../../ui/dialog";
import { DateCell } from "../../ui/cells";
import { localized } from "../../../utils/format";

export type WhatCanDoDetailsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The row to show; kept by the caller after closing for the close animation. */
  item: WhatCanDoDetails | null;
};

function DetailRow({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1.5 text-sm text-foreground">{children}</dd>
    </div>
  );
}

/** Full text in its language's direction, or an em dash when empty. */
function DetailText({
  value,
  lang,
}: {
  value: string | null;
  lang: "en" | "ar";
}) {
  if (!value) return <span className="text-muted-foreground">—</span>;
  return (
    <p
      lang={lang}
      dir={lang === "ar" ? "rtl" : "ltr"}
      className="whitespace-pre-wrap break-words"
    >
      {value}
    </p>
  );
}

/** Read-only view of every field of a "what I can do" item, opened from the row's View action. */
export function WhatCanDoDetailsDialog({
  open,
  onOpenChange,
  item,
}: WhatCanDoDetailsDialogProps) {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <AppDialog
      open={open}
      onOpenChange={onOpenChange}
      className="sm:max-w-2xl"
      title={t("whatCanDoDetailsTitle")}
      description={t("whatCanDoDetailsDescription")}
      Icon={Sparkles}
    >
      {item && (
        <div className="space-y-6">
          <div className="flex items-center gap-4 rounded-lg border border-border bg-muted/30 p-4">
            <div className="min-w-0 flex-1 space-y-1">
              <p className="truncate text-base font-semibold" dir="auto">
                {localized(locale, item.title_en, item.title_ar)}
              </p>
              <p className="text-xs text-muted-foreground tabular-nums">
                #{item.id}
              </p>
            </div>
            <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary tabular-nums">
              {t("tableColRank")}: {item.rank}
            </span>
          </div>

          <dl className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
            <DetailRow label={t("whatCanDoFormTitleEnLabel")}>
              <span lang="en" dir="ltr" className="font-medium">
                {item.title_en}
              </span>
            </DetailRow>
            <DetailRow label={t("whatCanDoFormTitleArLabel")}>
              {item.title_ar ? (
                <span lang="ar" dir="rtl" className="font-medium">
                  {item.title_ar}
                </span>
              ) : (
                <span className="text-muted-foreground">—</span>
              )}
            </DetailRow>
            <DetailRow label={t("whatCanDoFormShortDescriptionEnLabel")}>
              <DetailText value={item.shortDescription_en} lang="en" />
            </DetailRow>
            <DetailRow label={t("whatCanDoFormShortDescriptionArLabel")}>
              <DetailText value={item.shortDescription_ar} lang="ar" />
            </DetailRow>
            <DetailRow
              label={t("whatCanDoFormDescriptionEnLabel")}
              className="sm:col-span-2"
            >
              <DetailText value={item.description_en} lang="en" />
            </DetailRow>
            <DetailRow
              label={t("whatCanDoFormDescriptionArLabel")}
              className="sm:col-span-2"
            >
              <DetailText value={item.description_ar} lang="ar" />
            </DetailRow>
            <DetailRow label={t("tableColCreatedAt")}>
              <DateCell value={item.createdAt} />
            </DetailRow>
          </dl>
        </div>
      )}
    </AppDialog>
  );
}
