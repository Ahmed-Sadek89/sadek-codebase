"use client";

import { useWatch, type Control } from "react-hook-form";
import { cn } from "@repo/ui/utils";
import type { SeoFormInput, SeoFormValues } from "../schema";

type CharCountField = {
  [K in keyof SeoFormInput]: SeoFormInput[K] extends string ? K : never;
}[keyof SeoFormInput];

type CharCountProps = {
  control: Control<SeoFormInput, unknown, SeoFormValues>;
  name: CharCountField;
  max: number;
};

/** "42 / 70" for a text field; turns red past the limit. */
export function CharCount({ control, name, max }: CharCountProps) {
  const value = useWatch({ control, name });
  const count = value.trim().length;

  return (
    <span
      className={cn("shrink-0 tabular-nums", count > max && "text-danger")}
      aria-live="polite"
    >
      {count} / {max}
    </span>
  );
}

type FieldHintProps = Partial<CharCountProps> & {
  hint: string;
};

/** A field's short help, with its character count at the end when `max` is set. */
export function FieldHint({ hint, control, name, max }: FieldHintProps) {
  return (
    <span className="flex items-start justify-between gap-3">
      <span>{hint}</span>
      {control && name && max !== undefined && (
        <CharCount control={control} name={name} max={max} />
      )}
    </span>
  );
}
