"use client";

import { Languages } from "@repo/ui/icons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";
import { DEFAULT_LANGUAGE, LANGUAGE_OPTIONS } from "./utils/constants";

// Static UI for now: the selection does not change the locale yet.
export function LanguageSelect() {
  return (
    <Select defaultValue={DEFAULT_LANGUAGE}>
      <SelectTrigger aria-label="Select language" className="w-36 border-0">
        <Languages className="text-muted-foreground" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {LANGUAGE_OPTIONS.map(({ value, label }) => (
          <SelectItem key={value} value={value} lang={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
