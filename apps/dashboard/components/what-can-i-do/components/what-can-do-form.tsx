"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import type { WhatCanDoDetails } from "@repo/types/what-can-do";
import { Button } from "@repo/ui/button";
import type { LucideIcon } from "@repo/ui/icons";
import { AppDialog } from "../../ui/dialog";
import { BaseInput } from "../../ui/forms/base-input";
import { BaseTextarea } from "../../ui/forms/base-textarea";
import { useWhatCanDoForm } from "../hooks/use-what-can-do-form";
import { toWhatCanDoFormInput } from "../utils/constants";
import {
  WHAT_CAN_DO_SHORT_DESCRIPTION_MAX,
  WHAT_CAN_DO_TITLE_MAX,
} from "../schema";

export type WhatCanDoFormProps = {
  isOpenDialog: boolean;
  handleOpenDialog: (open: boolean) => void;
  title: string;
  description?: string;
  Icon: LucideIcon;
  role?: "edit" | "create";
  defaultValues?: WhatCanDoDetails | null;
  nextRank?: number;
};

export function WhatCanDoForm({
  isOpenDialog,
  handleOpenDialog,
  title,
  description = "",
  Icon,
  role = "create",
  defaultValues = null,
  nextRank,
}: WhatCanDoFormProps) {
  const t = useTranslations();
  const { form, onSubmit } = useWhatCanDoForm({
    item: defaultValues,
    onSuccess: () => handleOpenDialog(false),
  });
  const { errors, isSubmitting } = form.formState;

  useEffect(() => {
    if (isOpenDialog) form.reset(toWhatCanDoFormInput(defaultValues, nextRank));
  }, [isOpenDialog, defaultValues, form]);

  return (
    <AppDialog
      open={isOpenDialog}
      onOpenChange={handleOpenDialog}
      className="sm:max-w-3xl max-h-[85dvh]! overflow-y-auto!"
      title={title}
      description={description}
      Icon={Icon}
    >
      <form
        onSubmit={onSubmit}
        noValidate
        className="space-y-5"
        aria-busy={isSubmitting}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <BaseInput
            id="title_en"
            label={t("whatCanDoFormTitleEnLabel")}
            placeholder={t("whatCanDoFormTitleEnPlaceholder")}
            dir="ltr"
            maxLength={WHAT_CAN_DO_TITLE_MAX}
            required
            disabled={isSubmitting}
            error={errors.title_en?.message}
            {...form.register("title_en")}
          />
          <BaseInput
            id="title_ar"
            label={t("whatCanDoFormTitleArLabel")}
            placeholder={t("whatCanDoFormTitleArPlaceholder")}
            dir="rtl"
            maxLength={WHAT_CAN_DO_TITLE_MAX}
            disabled={isSubmitting}
            error={errors.title_ar?.message}
            {...form.register("title_ar")}
          />
          <BaseTextarea
            id="shortDescription_en"
            label={t("whatCanDoFormShortDescriptionEnLabel")}
            placeholder={t("whatCanDoFormShortDescriptionEnPlaceholder")}
            dir="ltr"
            rows={2}
            maxLength={WHAT_CAN_DO_SHORT_DESCRIPTION_MAX}
            disabled={isSubmitting}
            error={errors.shortDescription_en?.message}
            {...form.register("shortDescription_en")}
          />
          <BaseTextarea
            id="shortDescription_ar"
            label={t("whatCanDoFormShortDescriptionArLabel")}
            placeholder={t("whatCanDoFormShortDescriptionArPlaceholder")}
            dir="rtl"
            rows={2}
            maxLength={WHAT_CAN_DO_SHORT_DESCRIPTION_MAX}
            disabled={isSubmitting}
            error={errors.shortDescription_ar?.message}
            {...form.register("shortDescription_ar")}
          />
          <BaseTextarea
            id="description_en"
            label={t("whatCanDoFormDescriptionEnLabel")}
            placeholder={t("whatCanDoFormDescriptionEnPlaceholder")}
            dir="ltr"
            rows={4}
            disabled={isSubmitting}
            error={errors.description_en?.message}
            {...form.register("description_en")}
          />
          <BaseTextarea
            id="description_ar"
            label={t("whatCanDoFormDescriptionArLabel")}
            placeholder={t("whatCanDoFormDescriptionArPlaceholder")}
            dir="rtl"
            rows={4}
            disabled={isSubmitting}
            error={errors.description_ar?.message}
            {...form.register("description_ar")}
          />
          <BaseInput
            id="rank"
            type="number"
            inputMode="numeric"
            min={0}
            step={1}
            label={t("whatCanDoFormRankLabel")}
            aria-describedby="rank-hint"
            dir="ltr"
            required
            disabled={isSubmitting}
            error={errors.rank?.message}
            {...form.register("rank")}
          />
          <p
            id="rank-hint"
            className="self-end pb-3 text-sm text-muted-foreground"
          >
            {t("whatCanDoFormRankHint")}
          </p>
        </div>
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline-danger"
            disabled={isSubmitting}
            onClick={() => handleOpenDialog(false)}
          >
            {t("categorySkillFormCancel")}
          </Button>
          <Button
            type="submit"
            variant={role === "create" ? "success" : "default"}
            disabled={isSubmitting}
          >
            {role === "create"
              ? t("whatCanDoFormSubmit")
              : t("categorySkillFormEditSubmit")}
          </Button>
        </div>
      </form>
    </AppDialog>
  );
}
