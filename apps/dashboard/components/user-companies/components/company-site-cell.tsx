"use client";

import { useTranslations } from "next-intl";
import { Globe } from "@repo/ui/icons";
import { LINK_CLASS_NAME } from "../utils/constants";

/** The company website as an icon link that opens in a new tab, or an em dash when unset. */
export function CompanySiteCell({ url }: { url: string | null }) {
  const t = useTranslations();
  if (!url) return <span className="text-muted-foreground">—</span>;
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={t("userCompanySiteLink")}
      title={url}
      className={LINK_CLASS_NAME}
    >
      <Globe className="size-4" aria-hidden />
    </a>
  );
}
