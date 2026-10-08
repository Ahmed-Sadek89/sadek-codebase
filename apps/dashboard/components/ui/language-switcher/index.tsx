"use client";

import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";
import { DEFAULT_LANGUAGE, LANGUAGE_OPTIONS } from "../../../utils/constants";

// Static UI for now: the selection does not change the locale yet.
export function LanguageSelect() {
  return (
    <Select defaultValue={DEFAULT_LANGUAGE}>
      <SelectTrigger aria-label="Select language" className="w-36 border-0">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {LANGUAGE_OPTIONS.map(({ value, label, flag }) => (
          <SelectItem key={value} value={value} lang={value}>
            {/* Decorative: the label already names the language. */}
            <Image
              src={flag}
              alt={value}
              width={20}
              height={15}
              priority
              className="h-3.75 w-5 shrink-0 rounded-xs object-cover ring-1 ring-border"
            />
            <span>{label}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
