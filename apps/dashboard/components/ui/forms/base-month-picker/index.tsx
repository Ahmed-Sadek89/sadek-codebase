"use client";

import { useId, useState } from "react";
import { useFormatter, useTranslations } from "next-intl";
import { Button } from "@repo/ui/button";
import { Label } from "@repo/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/popover";
import { CalendarDays, ChevronLeft, ChevronRight } from "@repo/ui/icons";
import { cn } from "@repo/ui/utils";

export type BaseMonthPickerProps = {
  label: string;
  /** "YYYY-MM", or "" when empty. */
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  /** Earliest / latest selectable month, "YYYY-MM"; others are disabled. */
  min?: string;
  max?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  id?: string;
  containerClassName?: string;
};

const MONTH_VALUE = /^(\d{4})-(\d{2})$/;
const MONTHS = Array.from({ length: 12 }, (_, index) => index);

/** "YYYY-MM" → its year and 0-based month, or null when empty/invalid. */
function parseMonth(value: string | undefined) {
  const match = value ? MONTH_VALUE.exec(value) : null;
  if (!match) return null;
  const month = Number(match[2]) - 1;
  return month >= 0 && month < 12 ? { year: Number(match[1]), month } : null;
}

function toMonthValue(year: number, month: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}`;
}

/**
 * Month and year picker: a trigger showing the picked month (e.g. "Mar 2024")
 * that opens a year switcher and a 12-month grid. Values are "YYYY-MM"
 * strings, so they compare as text; months outside `min`/`max` are disabled.
 */
export function BaseMonthPicker({
  label,
  value,
  onChange,
  onBlur,
  min,
  max,
  placeholder,
  error,
  disabled,
  id,
  containerClassName,
}: BaseMonthPickerProps) {
  const t = useTranslations();
  const format = useFormatter();
  const generatedId = useId();
  const triggerId = id ?? generatedId;
  const errorId = `${triggerId}-error`;
  const selected = parseMonth(value);
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(
    () => selected?.year ?? new Date().getFullYear(),
  );

  const monthName = (year: number, month: number, style: "short" | "long") =>
    format.dateTime(new Date(Date.UTC(year, month, 1)), { month: style });
  const yearText = format.number(viewYear, { useGrouping: false });

  const onOpenChange = (next: boolean) => {
    // Each opening starts on the picked year (or the earliest allowed one).
    if (next) {
      setViewYear(
        selected?.year ?? parseMonth(min)?.year ?? new Date().getFullYear(),
      );
    } else {
      onBlur?.();
    }
    setOpen(next);
  };

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
            aria-describedby={error ? errorId : undefined}
            className={cn(
              "flex h-11 w-full items-center justify-between gap-2 rounded-md border border-input bg-background px-3 text-start text-sm transition-colors outline-none",
              "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50",
              "aria-invalid:border-danger aria-invalid:focus-visible:ring-danger/30",
              "disabled:cursor-not-allowed disabled:opacity-50",
            )}
          >
            <span className={cn("truncate", !selected && "text-muted-foreground")}>
              {selected
                ? format.dateTime(
                    new Date(Date.UTC(selected.year, selected.month, 1)),
                    { month: "short", year: "numeric" },
                  )
                : (placeholder ?? t("monthPickerPlaceholder"))}
            </span>
            <CalendarDays
              className="size-4 shrink-0 text-muted-foreground"
              aria-hidden
            />
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-72 p-3">
          <div className="mb-3 flex items-center justify-between">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setViewYear((year) => year - 1)}
              aria-label={t("monthPickerPrevYear")}
              title={t("monthPickerPrevYear")}
            >
              <ChevronLeft className="size-4 rtl:rotate-180" aria-hidden />
            </Button>
            <span className="text-sm font-semibold" aria-live="polite">
              {yearText}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setViewYear((year) => year + 1)}
              aria-label={t("monthPickerNextYear")}
              title={t("monthPickerNextYear")}
            >
              <ChevronRight className="size-4 rtl:rotate-180" aria-hidden />
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {MONTHS.map((month) => {
              const monthValue = toMonthValue(viewYear, month);
              const isSelected =
                selected?.year === viewYear && selected.month === month;
              const isDisabled =
                (min !== undefined && monthValue < min) ||
                (max !== undefined && monthValue > max);
              return (
                <button
                  key={month}
                  type="button"
                  disabled={isDisabled}
                  aria-pressed={isSelected}
                  aria-label={`${monthName(viewYear, month, "long")} ${yearText}`}
                  onClick={() => {
                    onChange(monthValue);
                    onOpenChange(false);
                  }}
                  className={cn(
                    "h-9 rounded-md text-sm transition-colors outline-none",
                    "focus-visible:ring-2 focus-visible:ring-ring/50",
                    "disabled:cursor-not-allowed disabled:opacity-40",
                    isSelected
                      ? "bg-primary font-medium text-primary-foreground"
                      : "hover:bg-muted",
                  )}
                >
                  {monthName(viewYear, month, "short")}
                </button>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
      {error && (
        <p id={errorId} role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
