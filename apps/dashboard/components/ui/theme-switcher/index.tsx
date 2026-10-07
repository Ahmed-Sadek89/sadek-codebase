"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";
import { DEFAULT_THEME, THEME_OPTIONS } from "./utils/constants";

export function ThemeSelect() {
  return (
    <Select defaultValue={DEFAULT_THEME}>
      <SelectTrigger aria-label="Select theme" className="w-32 border-0">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {THEME_OPTIONS.map(({ value, label, icon: Icon }) => (
          <SelectItem key={value} value={value}>
            <Icon className="text-muted-foreground" />
            <span>{label}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
