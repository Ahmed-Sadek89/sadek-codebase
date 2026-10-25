"use client";

import { useTranslations } from "next-intl";
import { useFieldArray, useWatch } from "react-hook-form";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";
import { Plus, Trash2 } from "@repo/ui/icons";
import { BaseInput } from "../../ui/forms/base-input";
import { FormSection } from "../../ui/forms/form-section";
import { HREFLANG_LANG_MAX, HREFLANG_MAX, URL_MAX } from "../schema";
import { HREFLANG_SUGGESTIONS } from "../utils/constants";
import type { SeoSectionProps } from "./search-section";

/** The canonical URL and the hreflang language alternates. */
export function UrlsSection({ form, disabled }: SeoSectionProps) {
  const t = useTranslations();
  const { errors } = form.formState;
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "hreflang",
  });
  const alternates = useWatch({ control: form.control, name: "hreflang" });
  const usedLangs = new Set(alternates.map(({ lang }) => lang.trim()));
  const isFull = fields.length >= HREFLANG_MAX;
  const listError = errors.hreflang?.message ?? errors.hreflang?.root?.message;

  return (
    <FormSection
      title={t("seoFormUrlsSection")}
      description={t("seoFormUrlsSectionHint")}
    >
      <BaseInput
        id="canonicalUrl"
        type="url"
        label={t("seoFormCanonicalUrlLabel")}
        placeholder="https://example.com/en"
        dir="ltr"
        maxLength={URL_MAX}
        disabled={disabled}
        error={errors.canonicalUrl?.message}
        description={t("seoFormCanonicalUrlHint")}
        {...form.register("canonicalUrl")}
      />

      <div className="space-y-2">
        <Label id="hreflang-label">{t("seoFormHreflangLabel")}</Label>
        <p id="hreflang-hint" className="text-xs text-muted-foreground">
          {t("seoFormHreflangHint")}
        </p>
        <ul
          aria-labelledby="hreflang-label"
          aria-describedby="hreflang-hint"
          className="space-y-3"
        >
          {fields.map((field, index) => {
            const rowErrors = errors.hreflang?.[index];
            return (
              <li key={field.id} className="space-y-1">
                <div className="grid grid-cols-[7rem_minmax(0,1fr)_auto] items-start gap-2">
                  <Input
                    aria-label={t("seoFormHreflangLangLabel", {
                      index: index + 1,
                    })}
                    aria-invalid={rowErrors?.lang ? true : undefined}
                    placeholder="en"
                    dir="ltr"
                    maxLength={HREFLANG_LANG_MAX}
                    disabled={disabled}
                    {...form.register(`hreflang.${index}.lang`)}
                  />
                  <Input
                    type="url"
                    aria-label={t("seoFormHreflangUrlLabel", {
                      index: index + 1,
                    })}
                    aria-invalid={rowErrors?.url ? true : undefined}
                    placeholder="https://example.com/en"
                    dir="ltr"
                    maxLength={URL_MAX}
                    disabled={disabled}
                    {...form.register(`hreflang.${index}.url`)}
                  />
                  <Button
                    type="button"
                    variant="outline-danger"
                    size="icon"
                    disabled={disabled}
                    aria-label={t("seoFormHreflangRemove", {
                      index: index + 1,
                    })}
                    title={t("seoFormHreflangRemove", { index: index + 1 })}
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="size-4" aria-hidden />
                  </Button>
                </div>
                {(rowErrors?.lang || rowErrors?.url) && (
                  <p role="alert" className="text-sm text-danger">
                    {[rowErrors.lang?.message, rowErrors.url?.message]
                      .filter(Boolean)
                      .join(" · ")}
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
        <div className="flex flex-wrap gap-2">
          {HREFLANG_SUGGESTIONS.filter((lang) => !usedLangs.has(lang)).map(
            (lang) => (
              <Button
                key={lang}
                type="button"
                variant="outline"
                size="sm"
                disabled={disabled || isFull}
                onClick={() => append({ lang, url: "" })}
              >
                <Plus className="size-3.5" aria-hidden />
                <span dir="ltr">{lang}</span>
              </Button>
            ),
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled || isFull}
            onClick={() => append({ lang: "", url: "" })}
          >
            <Plus className="size-3.5" aria-hidden />
            {t("seoFormHreflangAdd")}
          </Button>
        </div>
      </div>
    </FormSection>
  );
}
