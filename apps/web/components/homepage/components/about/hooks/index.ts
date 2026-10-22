"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import type { UserInfoDetails } from "@repo/types/user-info";
import { localize } from "../../../../../utils/localize";
import { hasText } from "../../../utils";
import { COLLAPSE_AFTER_CHARS, getStats } from "../utils";

export function useAboutContent(info: UserInfoDetails | undefined) {
  const locale = useLocale();
  return {
    description:
      info && localize(locale, info.description_en, info.description_ar),
    stats: info ? getStats(info) : [],
    cvUrl: hasText(info?.cv) ? info.cv : undefined,
  };
}

/** "Read more" state for a description; short ones never collapse. */
export function useCollapsible(text: string) {
  const [expanded, setExpanded] = useState(false);
  const collapsible = text.length > COLLAPSE_AFTER_CHARS;
  return {
    collapsible,
    collapsed: collapsible && !expanded,
    toggle: () => setExpanded((value) => !value),
  };
}
