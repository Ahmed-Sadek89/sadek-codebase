import type { WhatCanDo } from "@repo/types/what-can-do";
import { ChevronRight } from "@repo/ui/icons";
import { formatIndex } from "../utils";

export function ServiceRow({
  service,
  index,
}: {
  service: WhatCanDo;
  index: number;
}) {
  return (
    <div className="grid grid-cols-[45px_1fr_20px] items-center border-b border-border py-[18px]">
      <span className="text-xs text-primary">{formatIndex(index)}</span>
      <div>
        <h3 className="m-0 text-[13px]">{service.title_en}</h3>
        {service.shortDescription_en && (
          <p className="my-1 text-[10px] text-muted-foreground">
            {service.shortDescription_en}
          </p>
        )}
      </div>
      <ChevronRight className="w-[13px] text-muted-foreground" />
    </div>
  );
}
