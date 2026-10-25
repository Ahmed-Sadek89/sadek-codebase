"use client";

import type { ClipboardEvent, KeyboardEvent } from "react";
import { useTranslations } from "next-intl";
import { useFieldArray, type UseFormReturn } from "react-hook-form";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";
import { Plus, Trash2 } from "@repo/ui/icons";
import {
  SKILL_NAME_MAX,
  SKILLS_BULK_MAX,
  type SkillFormInput,
  type SkillFormValues,
} from "../schema";

export type SkillNamesFieldProps = {
  form: UseFormReturn<SkillFormInput, unknown, SkillFormValues>;
  disabled?: boolean;
  /** Create mode: rows can be added, removed, and pasted. Edit mode keeps one row. */
  multiple?: boolean;
};

/** Splits pasted text on new lines and commas into trimmed, non-empty names. */
const splitNames = (text: string) =>
  text
    .split(/[\n,]/)
    .map((name) => name.trim())
    .filter(Boolean);

/**
 * The skill name rows. In create mode Enter adds a row below and a pasted
 * list (one per line or comma-separated) fills one row per name.
 */
export function SkillNamesField({
  form,
  disabled,
  multiple = false,
}: SkillNamesFieldProps) {
  const t = useTranslations();
  const { errors } = form.formState;
  const { fields, insert, remove } = useFieldArray({
    control: form.control,
    name: "names",
  });
  const isFull = fields.length >= SKILLS_BULK_MAX;
  const listError = errors.names?.message ?? errors.names?.root?.message;

  const onKeyDown = (index: number) => (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter" || event.nativeEvent.isComposing) return;
    // Enter starts the next name instead of submitting the form.
    event.preventDefault();
    if (!isFull) insert(index + 1, { value: "" });
  };

  const onPaste = (index: number) => (event: ClipboardEvent<HTMLInputElement>) => {
    const names = splitNames(event.clipboardData.getData("text"));
    // A single name pastes normally into the row.
    if (names.length < 2) return;
    event.preventDefault();
    const [first, ...rest] = names;
    const isEmptyRow = !form.getValues(`names.${index}.value`).trim();
    const room = SKILLS_BULK_MAX - fields.length;
    if (isEmptyRow) {
      form.setValue(`names.${index}.value`, first!, { shouldValidate: true });
      insert(index + 1, rest.slice(0, room).map((value) => ({ value })));
    } else {
      insert(index + 1, names.slice(0, room).map((value) => ({ value })));
    }
  };

  return (
    <div className="space-y-2">
      <Label id="skill-names-label" htmlFor={multiple ? undefined : "names.0.value"}>
        {multiple ? t("skillFormNamesLabel") : t("skillFormNameLabel")}
      </Label>
      {multiple && (
        <p id="skill-names-hint" className="text-xs text-muted-foreground">
          {t("skillFormNamesHint", { max: SKILLS_BULK_MAX })}
        </p>
      )}
      <ul
        aria-labelledby="skill-names-label"
        aria-describedby={multiple ? "skill-names-hint" : undefined}
        className="space-y-2"
      >
        {fields.map((field, index) => {
          const error = errors.names?.[index]?.value?.message;
          return (
            <li key={field.id} className="space-y-1">
              <div className="flex items-start gap-2">
                <Input
                  id={`names.${index}.value`}
                  aria-label={
                    multiple
                      ? t("skillFormNameRowLabel", { index: index + 1 })
                      : undefined
                  }
                  aria-invalid={error ? true : undefined}
                  placeholder={t("skillFormNamePlaceholder")}
                  dir="auto"
                  maxLength={SKILL_NAME_MAX}
                  required
                  disabled={disabled}
                  {...(multiple && {
                    onKeyDown: onKeyDown(index),
                    onPaste: onPaste(index),
                  })}
                  {...form.register(`names.${index}.value`)}
                />
                {multiple && (
                  <Button
                    type="button"
                    variant="outline-danger"
                    size="icon"
                    className="shrink-0"
                    disabled={disabled || fields.length === 1}
                    aria-label={t("skillFormNameRemove", { index: index + 1 })}
                    title={t("skillFormNameRemove", { index: index + 1 })}
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="size-4" aria-hidden />
                  </Button>
                )}
              </div>
              {error && (
                <p role="alert" className="text-sm text-danger">
                  {error}
                </p>
              )}
            </li>
          );
        })}
      </ul>
      {listError && (
        <p role="alert" className="text-sm text-danger">
          {listError}
        </p>
      )}
      {multiple && (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled || isFull}
            onClick={() => insert(fields.length, { value: "" })}
          >
            <Plus className="size-3.5" aria-hidden />
            {t("skillFormNameAdd")}
          </Button>
          <span className="text-xs text-muted-foreground tabular-nums" aria-live="polite">
            {fields.length}/{SKILLS_BULK_MAX}
          </span>
        </div>
      )}
    </div>
  );
}
