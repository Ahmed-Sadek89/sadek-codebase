"use client";

import { useEffect } from "react";
import type { CategorySkill } from "@repo/types/category-skills";
import { useTranslations } from "next-intl";
import { Controller } from "react-hook-form";
import { Button } from "@repo/ui/button";
import { Eye } from "@repo/ui/icons";
import { AppDialog } from "../../ui/dialog";
import { BaseInput } from "../../ui/forms/base-input";
import { BaseTextarea } from "../../ui/forms/base-textarea";
import { BaseSwitch } from "../../ui/forms/base-switch";
import { useCategorySkillForm } from "../hooks/use-category-skill-form";
import { toCategorySkillFormInput } from "../utils/constants";
import {
    CATEGORY_SKILL_DESCRIPTION_MAX,
    CATEGORY_SKILL_NAME_MAX,
} from "../schema";
import { LucideIcon } from "@repo/ui/icons";

export type CategorySkillsFormProps = {
    isOpenDialog: boolean;
    handleOpenDialog: (open: boolean) => void;
    /** Dialog header content, e.g. `<CategorySkillsHeaderForm />`. */
    title: string,
    description?: string,
    Icon: LucideIcon,
    role?: "edit" | "create"
    /** The selected row when editing; its values fill the inputs. */
    defaultValues?: CategorySkill | null;

};

/** Create/edit-category dialog: English/Arabic names and descriptions plus an active switch. */
export function CategorySkillsForm({
    isOpenDialog,
    handleOpenDialog,
    title,
    description = "",
    Icon,
    role = "create",
    defaultValues = null,
}: CategorySkillsFormProps) {
    const t = useTranslations();
    const { form, onSubmit } = useCategorySkillForm({
        category: defaultValues,
        onSuccess: () => handleOpenDialog(false),
    });
    const { errors, isSubmitting } = form.formState;

    // Fill the inputs each time the dialog opens: the selected row when
    // editing, blank when creating. Not on close, so fields don't flash empty
    // during the close animation.
    useEffect(() => {
        if (isOpenDialog) form.reset(toCategorySkillFormInput(defaultValues));
    }, [isOpenDialog, defaultValues, form]);

    const onOpenChange = (open: boolean) => handleOpenDialog(open);

    return (
        <AppDialog
            open={isOpenDialog}
            onOpenChange={onOpenChange}
            className="sm:max-w-2xl"
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
                        id="nameEn"
                        label={t("categorySkillFormNameEnLabel")}
                        placeholder={t("categorySkillFormNameEnPlaceholder")}
                        dir="ltr"
                        maxLength={CATEGORY_SKILL_NAME_MAX}
                        required
                        disabled={isSubmitting}
                        error={errors.nameEn?.message}
                        {...form.register("nameEn")}
                    />
                    <BaseInput
                        id="nameAr"
                        label={t("categorySkillFormNameArLabel")}
                        placeholder={t("categorySkillFormNameArPlaceholder")}
                        dir="rtl"
                        maxLength={CATEGORY_SKILL_NAME_MAX}
                        required
                        disabled={isSubmitting}
                        error={errors.nameAr?.message}
                        {...form.register("nameAr")}
                    />
                    <BaseTextarea
                        id="descriptionEn"
                        label={t("categorySkillFormDescriptionEnLabel")}
                        placeholder={t("categorySkillFormDescriptionEnPlaceholder")}
                        dir="ltr"
                        rows={3}
                        maxLength={CATEGORY_SKILL_DESCRIPTION_MAX}
                        disabled={isSubmitting}
                        error={errors.descriptionEn?.message}
                        {...form.register("descriptionEn")}
                    />
                    <BaseTextarea
                        id="descriptionAr"
                        label={t("categorySkillFormDescriptionArLabel")}
                        placeholder={t("categorySkillFormDescriptionArPlaceholder")}
                        dir="rtl"
                        rows={3}
                        maxLength={CATEGORY_SKILL_DESCRIPTION_MAX}
                        disabled={isSubmitting}
                        error={errors.descriptionAr?.message}
                        {...form.register("descriptionAr")}
                    />
                    <BaseInput
                        id="rank"
                        type="number"
                        inputMode="numeric"
                        min={0}
                        step={1}
                        label={t("categorySkillFormRankLabel")}
                        description={t("categorySkillFormRankHint")}
                        dir="ltr"
                        required
                        disabled={isSubmitting}
                        error={errors.rank?.message}
                        {...form.register("rank")}
                    />
                </div>
                <Controller
                    control={form.control}
                    name="isActive"
                    render={({ field, fieldState }) => (
                        <BaseSwitch
                            id={field.name}
                            label={t("categorySkillFormActiveLabel")}
                            description={t("categorySkillFormActiveHint")}
                            icon={<Eye className="size-4" />}
                            checkedText={t("categorySkillFormActiveOn")}
                            uncheckedText={t("categorySkillFormActiveOff")}
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            onBlur={field.onBlur}
                            ref={field.ref}
                            disabled={isSubmitting}
                            error={fieldState.error?.message}
                        />
                    )}
                />
                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                    <Button
                        type="button"
                        variant="outline-danger"
                        disabled={isSubmitting}
                        onClick={() => onOpenChange(false)}
                    >
                        {t("categorySkillFormCancel")}
                    </Button>
                    <Button type="submit"
                        variant={role === "create" ? "success" : "default"}
                        disabled={isSubmitting}>
                        {role === "create"
                            ? t("categorySkillFormSubmit")
                            : t("categorySkillFormEditSubmit")}
                    </Button>
                </div>
            </form>
        </AppDialog>
    );
}
