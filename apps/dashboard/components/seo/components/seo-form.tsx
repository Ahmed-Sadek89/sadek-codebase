"use client";

import { useEffect } from "react";
import type { Seo } from "@repo/types/seo";
import { useTranslations } from "next-intl";
import { Button } from "@repo/ui/button";
import type { LucideIcon } from "@repo/ui/icons";
import { AppDialog } from "../../ui/dialog";
import { useSeoForm } from "../hooks/use-seo-form";
import { toSeoFormInput } from "../utils/constants";
import { IndexingSection } from "./indexing-section";
import { PageSection } from "./page-section";
import { SearchSection } from "./search-section";
import { SocialSection } from "./social-section";
import { UrlsSection } from "./urls-section";

export type SeoFormProps = {
  isOpenDialog: boolean;
  handleOpenDialog: (open: boolean) => void;
  title: string;
  description?: string;
  Icon: LucideIcon;
  role?: "edit" | "create";
  /** The selected row when editing; its values fill the inputs. */
  defaultValues?: Seo | null;
};

/** Create/edit dialog for one SEO version of a website page: page, search, sharing and indexing. */
export function SeoForm({
  isOpenDialog,
  handleOpenDialog,
  title,
  description = "",
  Icon,
  role = "create",
  defaultValues = null,
}: SeoFormProps) {
  const t = useTranslations();
  const { form, onSubmit } = useSeoForm({
    seo: defaultValues,
    onSuccess: () => handleOpenDialog(false),
  });
  const { isSubmitting } = form.formState;

  // Fill the inputs each time the dialog opens: the selected row when
  // editing, blank when creating. Not on close, so fields don't flash empty
  // during the close animation.
  useEffect(() => {
    if (isOpenDialog) form.reset(toSeoFormInput(defaultValues));
  }, [isOpenDialog, defaultValues, form]);

  const onOpenChange = (open: boolean) => handleOpenDialog(open);

  return (
    <AppDialog
      open={isOpenDialog}
      onOpenChange={onOpenChange}
      className="sm:max-w-5xl max-h-[85dvh]! overflow-y-auto!"
      title={title}
      description={description}
      Icon={Icon}
    >
      <form
        onSubmit={onSubmit}
        noValidate
        className="space-y-6"
        aria-busy={isSubmitting}
      >
        <PageSection form={form} disabled={isSubmitting} />
        <SearchSection form={form} disabled={isSubmitting} />
        <UrlsSection form={form} disabled={isSubmitting} />
        <SocialSection form={form} disabled={isSubmitting} />
        <IndexingSection form={form} disabled={isSubmitting} />

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline-danger"
            disabled={isSubmitting}
            onClick={() => onOpenChange(false)}
          >
            {t("seoFormCancel")}
          </Button>
          <Button
            type="submit"
            variant={role === "create" ? "success" : "default"}
            disabled={isSubmitting}
          >
            {role === "create"
              ? t("seoFormSubmit")
              : t("seoFormEditSubmit")}
          </Button>
        </div>
      </form>
    </AppDialog>
  );
}
