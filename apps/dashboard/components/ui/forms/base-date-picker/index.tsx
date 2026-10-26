"use client";

import { useId, useState } from "react";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import { Calendar, CALENDAR_LOCALES } from "@repo/ui/calendar";
import { Label } from "@repo/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/popover";
import { CalendarDays } from "@repo/ui/icons";
import { cn } from "@repo/ui/utils";
import { getDirection } from "../../../../i18n/config";

export type BaseDatePickerProps = {
  label: string;
  /** "YYYY-MM-DD", or "" when empty. */
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  /** Earliest / latest selectable day, "YYYY-MM-DD"; others are disabled. */
  min?: string;
  max?: string;
  placeholder?: string;
  /** A short help line under the field. */
  description?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  id?: string;
  containerClassName?: string;
};

const DATE_VALUE = /^(\d{4})-(\d{2})-(\d{2})$/;
/** Years the month/year dropdowns offer around today. */
const YEARS_BACK = 30;
const YEARS_AHEAD = 10;

/** "YYYY-MM-DD" → that day at local midnight (what the calendar works in), or undefined. */
function parseDate(value: string | undefined): Date | undefined {
  const match = value ? DATE_VALUE.exec(value) : null;
  if (!match) return undefined;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function toDateValue(date: Date): string {
  const pad = (part: number) => String(part).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/**
 * Date picker: a trigger showing the picked day in the active locale that
 * opens the shadcn Calendar (`@repo/ui/calendar`) with month and year
 * dropdowns. Values are "YYYY-MM-DD" strings, so they compare as text; days
 * outside `min`/`max` are disabled. Use it through a React Hook Form `Controller`.
 */
export function BaseDatePicker({
  label,
  value,
  onChange,
  onBlur,
  min,
  max,
  placeholder,
  description,
  error,
  required,
  disabled,
  id,
  containerClassName,
}: BaseDatePickerProps) {
  const t = useTranslations();
  const format = useFormatter();
  const locale = useLocale();
  const generatedId = useId();
  const triggerId = id ?? generatedId;
  const descriptionId = `${triggerId}-description`;
  const errorId = `${triggerId}-error`;
  const selected = parseDate(value);
  const minDate = parseDate(min);
  const maxDate = parseDate(max);
  const [open, setOpen] = useState(false);
  const thisYear = new Date().getFullYear();

  const onOpenChange = (next: boolean) => {
    if (!next) onBlur?.();
    setOpen(next);
  };

  const describedBy =
    [description && descriptionId, error && errorId].filter(Boolean).join(" ") ||
    undefined;

  return (
    <div className={cn("flex flex-col gap-y-2", containerClassName)}>
      <Label htmlFor={triggerId}>{label}</Label>
      <Popover open={open} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>
          <button
            id={triggerId}
            type="button"
            disabled={disabled}
            aria-invalid={error ? true : undefined}
            aria-required={required || undefined}
            aria-describedby={describedBy}
            className={cn(
              "flex h-11 w-full items-center justify-between gap-2 rounded-md border border-input bg-background px-3 text-start text-sm transition-colors outline-none",
              "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50",
              "aria-invalid:border-danger aria-invalid:focus-visible:ring-danger/30",
              "disabled:cursor-not-allowed disabled:opacity-50",
            )}
          >
            <span className={cn("truncate", !selected && "text-muted-foreground")}>
              {selected
                ? // next-intl formats in UTC, so format the same calendar day in UTC.
                  format.dateTime(
                    new Date(
                      Date.UTC(
                        selected.getFullYear(),
                        selected.getMonth(),
                        selected.getDate(),
                      ),
                    ),
                    { day: "numeric", month: "long", year: "numeric" },
                  )
                : (placeholder ?? t("datePickerPlaceholder"))}
            </span>
            <CalendarDays className="size-4 shrink-0 text-muted-foreground" aria-hidden />
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-0">
          <Calendar
            mode="single"
            selected={selected}
            defaultMonth={selected ?? minDate}
            onSelect={(date) => {
              if (!date) return;
              onChange(toDateValue(date));
              onOpenChange(false);
            }}
            disabled={[
              ...(minDate ? [{ before: minDate }] : []),
              ...(maxDate ? [{ after: maxDate }] : []),
            ]}
            captionLayout="dropdown"
            startMonth={new Date(thisYear - YEARS_BACK, 0)}
            endMonth={new Date(thisYear + YEARS_AHEAD, 11)}
            locale={CALENDAR_LOCALES[locale] ?? CALENDAR_LOCALES.en}
            dir={getDirection(locale)}
            autoFocus
          />
        </PopoverContent>
      </Popover>
      {description && (
        <p id={descriptionId} className="text-xs text-muted-foreground">
          {description}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
