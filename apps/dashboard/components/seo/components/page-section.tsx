"use client";

import { useLocale, useTranslations } from "next-intl";
import { Controller } from "react-hook-form";
import { usePages } from "@repo/hooks/pages";
import { useSeoList } from "@repo/hooks/seo";
import { Label } from "@repo/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";
import { Link } from "../../../i18n/navigation";
import { FormSection } from "../../ui/forms/form-section";
import { pageLabel, SEO_PAGE_OPTIONS_QUERY } from "../utils/constants";
import type { SeoSectionProps } from "./search-section";

type PageSectionProps = SeoSectionProps & {
  /** The edited row's page, which stays selectable although it has SEO. */
  currentPageId?: number;
};

/** The website page this SEO is for, chosen first; pages that already have SEO are disabled. */
export function PageSection({ form, disabled, currentPageId }: PageSectionProps) {
  const t = useTranslations();
  const locale = useLocale();
  const pages = usePages(SEO_PAGE_OPTIONS_QUERY);
  const seoRows = useSeoList(SEO_PAGE_OPTIONS_QUERY);
  const takenPageIds = new Set(seoRows.data?.data.map((seo) => seo.pageId));
  const options = pages.data?.data ?? [];
  const hasNoPages = pages.isSuccess && options.length === 0;

  return (
    <FormSection
      title={t("seoFormPageSection")}
      description={t("seoFormPageSectionHint")}
    >
      <Controller
        control={form.control}
        name="pageId"
        render={({ field, fieldState }) => (
          <div className="flex flex-col gap-y-2 sm:max-w-sm">
            <Label htmlFor={field.name}>{t("seoFormPageLabel")}</Label>
            <Select
              value={field.value}
              onValueChange={field.onChange}
              disabled={disabled || pages.isPending || hasNoPages}
            >
              <SelectTrigger
                id={field.name}
                ref={field.ref}
                onBlur={field.onBlur}
                className="w-full"
                aria-invalid={fieldState.error ? true : undefined}
                aria-describedby={`${field.name}-hint`}
              >
                <SelectValue
                  placeholder={
                    pages.isPending ? t("seoFormPageLoading") : t("seoFormPagePlaceholder")
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {options.map((page) => {
                  const isTaken = takenPageIds.has(page.id) && page.id !== currentPageId;
                  return (
                    <SelectItem key={page.id} value={String(page.id)} disabled={isTaken}>
                      {pageLabel(locale, page)}
                      {isTaken && (
                        <span className="text-xs text-muted-foreground">
                          {" "}
                          · {t("seoFormPageTaken")}
                        </span>
                      )}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            <p id={`${field.name}-hint`} className="text-xs text-muted-foreground">
              {hasNoPages ? (
                <>
                  {t("seoFormNoPages")}{" "}
                  <Link href="/dashboard/pages" className="text-primary hover:underline">
                    {t("seoFormNoPagesLink")}
                  </Link>
                </>
              ) : (
                t("seoFormPageHint")
              )}
            </p>
            {fieldState.error && (
              <p role="alert" className="text-sm text-danger">
                {fieldState.error.message}
              </p>
            )}
          </div>
        )}
      />
    </FormSection>
  );
}
