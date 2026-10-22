import { useLocale } from "next-intl";
import type { WhatCanDo } from "@repo/types/what-can-do";
import { ChevronRight } from "@repo/ui/icons";
import { localize } from "../../../../../utils/localize";
import { formatIndex } from "../utils";

export function ServiceRow({
  service,
  index,
}: {
  service: WhatCanDo;
  index: number;
}) {
  const locale = useLocale();
  const summary = localize(
    locale,
    service.shortDescription_en,
    service.shortDescription_ar,
  );
  return (
    <div className="grid grid-cols-[45px_1fr_20px] items-center border-b border-border py-[18px]">
      <span className="text-xs text-primary">{formatIndex(index)}</span>
      <div>
        <h3 className="m-0 text-[13px]">
          {localize(locale, service.title_en, service.title_ar)}
        </h3>
        {summary && (
          <p className="my-1 text-[10px] text-muted-foreground">{summary}</p>
        )}
      </div>
      <ChevronRight className="w-[13px] text-muted-foreground rtl:-scale-x-100" />
    </div>
  );
}
