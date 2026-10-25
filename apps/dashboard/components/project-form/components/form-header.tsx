"use client";

import { useTranslations } from "next-intl";
import { Button } from "@repo/ui/button";
import { ArrowLeft, LoaderCircle, Plus, Save } from "@repo/ui/icons";

type FormHeaderProps = {
  isCreate: boolean;
  /** The project's name in the current locale (edit mode). */
  subtitle: string;
  isSubmitting: boolean;
  /** Back and Cancel: leave the page (asks first when there are unsaved changes). */
  onLeave: () => void;
};

/**
 * The page's sticky action bar, below the dashboard header: back link,
 * title, and Cancel / Save. Rendered inside the form, so Save submits it.
 */
export function FormHeader({
  isCreate,
  subtitle,
  isSubmitting,
  onLeave,
}: FormHeaderProps) {
  const t = useTranslations();

  return (
    <div className="sticky top-16 z-20 -mx-4 border-b border-border bg-background/90 px-4 py-3 backdrop-blur lg:-mx-6 lg:px-6">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="shrink-0"
            aria-label={t("projectFormBack")}
            title={t("projectFormBack")}
            onClick={onLeave}
          >
            <ArrowLeft className="size-4 rtl:-scale-x-100" aria-hidden />
          </Button>
          <div className="min-w-0">
            <button
              type="button"
              onClick={onLeave}
              className="text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              {t("projectFormBack")}
            </button>
            <h1 className="truncate text-lg font-semibold sm:text-xl">
              {isCreate ? t("projectFormTitle") : t("projectFormEditTitle")}
            </h1>
            <p className="truncate text-sm text-muted-foreground" dir="auto">
              {subtitle}
            </p>
          </div>
        </div>
        <div className="flex w-full gap-2 sm:w-auto">
          <Button
            type="button"
            variant="outline"
            className="flex-1 sm:flex-none"
            disabled={isSubmitting}
            onClick={onLeave}
          >
            {t("projectFormCancel")}
          </Button>
          <Button
            type="submit"
            variant={isCreate ? "success" : "default"}
            className="flex-1 sm:flex-none"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <LoaderCircle className="size-4 animate-spin" aria-hidden />
            ) : isCreate ? (
              <Plus className="size-4" aria-hidden />
            ) : (
              <Save className="size-4" aria-hidden />
            )}
            {isSubmitting
              ? t("projectFormSaving")
              : isCreate
                ? t("projectFormSubmit")
                : t("projectFormSave")}
          </Button>
        </div>
      </div>
    </div>
  );
}
