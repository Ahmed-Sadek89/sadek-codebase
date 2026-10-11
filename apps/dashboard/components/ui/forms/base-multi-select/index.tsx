"use client";

import { useId, useState, type Key } from "react";
import { useTranslations } from "next-intl";
import { Label } from "@repo/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/popover";
import { Check, ChevronsUpDown, Loader2, Search, X } from "@repo/ui/icons";
import { cn } from "@repo/ui/utils";

export type BaseMultiSelectProps<T> = {
  label: string;
  /** Selected items, shown as removable chips under the trigger. */
  value: T[];
  onChange: (value: T[]) => void;
  /** Items to pick from; filter them with `onSearchChange` (e.g. server search). */
  options: T[];
  getKey: (item: T) => Key;
  getLabel: (item: T) => string;
  /** Search box text; omit `onSearchChange` to hide the search box. */
  search?: string;
  onSearchChange?: (search: string) => void;
  searchMaxLength?: number;
  isLoading?: boolean;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  id?: string;
  onBlur?: () => void;
  containerClassName?: string;
};

/**
 * Multi-select: a trigger that opens a searchable list of toggleable options,
 * and the picks as removable chips below it. Keeps whole items (not just ids)
 * so chips keep their labels when the options list changes with the search.
 */
export function BaseMultiSelect<T>({
  label,
  value,
  onChange,
  options,
  getKey,
  getLabel,
  search,
  onSearchChange,
  searchMaxLength,
  isLoading = false,
  placeholder,
  error,
  disabled,
  id,
  onBlur,
  containerClassName,
}: BaseMultiSelectProps<T>) {
  const t = useTranslations();
  const generatedId = useId();
  const triggerId = id ?? generatedId;
  const errorId = `${triggerId}-error`;
  const [open, setOpen] = useState(false);
  const selectedKeys = new Set(value.map(getKey));

  const toggle = (item: T) => {
    const key = getKey(item);
    onChange(
      selectedKeys.has(key)
        ? value.filter((selected) => getKey(selected) !== key)
        : [...value, item],
    );
  };

  return (
    <div className={cn("flex flex-col gap-y-2", containerClassName)}>
      <Label htmlFor={triggerId}>{label}</Label>
      <Popover
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) onBlur?.();
        }}
      >
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
            <span
              className={cn(
                "truncate",
                value.length === 0 && "text-muted-foreground",
              )}
            >
              {value.length > 0
                ? t("multiSelectCount", { count: value.length })
                : (placeholder ?? t("multiSelectPlaceholder"))}
            </span>
            <ChevronsUpDown
              className="size-4 shrink-0 text-muted-foreground"
              aria-hidden
            />
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-(--radix-popover-trigger-width) min-w-64 p-0"
        >
          {onSearchChange && (
            <div className="flex items-center gap-2 border-b border-border px-3">
              <Search
                className="size-4 shrink-0 text-muted-foreground"
                aria-hidden
              />
              <input
                type="search"
                value={search ?? ""}
                maxLength={searchMaxLength}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder={t("multiSelectSearch")}
                aria-label={t("multiSelectSearch")}
                className="h-10 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:hidden"
              />
              {isLoading && (
                <Loader2
                  className="size-4 shrink-0 animate-spin text-muted-foreground"
                  aria-hidden
                />
              )}
            </div>
          )}
          <ul
            aria-label={label}
            aria-busy={isLoading}
            className="max-h-64 overflow-y-auto p-1"
          >
            {options.length === 0 ? (
              <li className="px-2 py-6 text-center text-sm text-muted-foreground">
                {isLoading ? t("multiSelectLoading") : t("multiSelectEmpty")}
              </li>
            ) : (
              options.map((option) => {
                const isSelected = selectedKeys.has(getKey(option));
                return (
                  <li key={getKey(option)}>
                    <button
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => toggle(option)}
                      className={cn(
                        "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-start text-sm outline-none transition-colors",
                        "hover:bg-muted focus-visible:bg-muted",
                        isSelected && "font-medium",
                      )}
                    >
                      <span
                        className={cn(
                          "flex size-4 shrink-0 items-center justify-center rounded-[4px] border",
                          isSelected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-input",
                        )}
                        aria-hidden
                      >
                        {isSelected && <Check className="size-3" />}
                      </span>
                      <span dir="auto" className="truncate">
                        {getLabel(option)}
                      </span>
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </PopoverContent>
      </Popover>
      {value.length > 0 && (
        <ul className="flex flex-wrap gap-1.5">
          {value.map((item) => (
            <li
              key={getKey(item)}
              className="inline-flex max-w-full items-center gap-1 rounded-full border border-primary/30 bg-primary/10 py-0.5 ps-2.5 pe-1 text-xs font-medium text-primary"
            >
              <span dir="auto" className="truncate">
                {getLabel(item)}
              </span>
              <button
                type="button"
                disabled={disabled}
                onClick={() => toggle(item)}
                aria-label={t("multiSelectRemove", { name: getLabel(item) })}
                className="rounded-full p-0.5 transition-colors hover:bg-primary/20 disabled:pointer-events-none"
              >
                <X className="size-3" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}
      {error && (
        <p id={errorId} role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
