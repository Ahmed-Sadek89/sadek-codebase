import type { WhatCanDo } from "@repo/types/what-can-do";
import type { AccordionListItem } from "../../../../ui/accordion";
import { localize } from "../../../../../utils/localize";

/** "01", "02", ... for the row index. */
export function formatIndex(index: number) {
  return String(index + 1).padStart(2, "0");
}

/** A service as an accordion card, in the page's language. */
export function toServiceItem(
  service: WhatCanDo,
  index: number,
  locale: string,
): AccordionListItem {
  const summary = localize(
    locale,
    service.shortDescription_en,
    service.shortDescription_ar,
  );
  const description = localize(
    locale,
    service.description_en,
    service.description_ar,
  );
  return {
    value: String(service.id),
    badge: formatIndex(index),
    title: localize(locale, service.title_en, service.title_ar),
    description: summary ?? undefined,
    // Without a long description, the summary is what opening reveals.
    content: description ?? summary ?? undefined,
  };
}
