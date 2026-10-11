"use client";

import { useId } from "react";
import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";
import {
  LIMIT_PARAM,
  PAGE_PARAM,
  PAGE_SIZE_OPTIONS,
} from "../../../../utils/constants";
import { updateUrlParams } from "../../../../utils/url-params";

export type TableRowsSelectProps = {
  /** Current page size (the response's `limit`). */
  limit: number;
};

/** shadcn Select for rows per page (5/10/15/20); writes `?limit=` and resets `?page=`. */
export function TableRowsSelect({ limit }: TableRowsSelectProps) {
  const t = useTranslations();
  const labelId = useId();
  // Keep a URL-supplied size (e.g. ?limit=30) selectable so the trigger is never blank.
  const options = [...new Set<number>([...PAGE_SIZE_OPTIONS, limit])].sort(
    (a, b) => a - b,
  );

  return (
    <div className="flex items-center gap-2 text-sm">
      <span id={labelId} className="whitespace-nowrap text-muted-foreground">
        {t("tableRowsPerPage")}
      </span>
      <Select
        value={String(limit)}
        onValueChange={(value) =>
          // Changing the size makes the current page number meaningless.
          updateUrlParams({ [LIMIT_PARAM]: value, [PAGE_PARAM]: null }, "push")
        }
      >
        <SelectTrigger aria-labelledby={labelId} className="h-9 w-20">
          {/* Explicit text so the server render is not blank before Radix hydrates. */}
          <SelectValue>{limit}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={String(option)}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
