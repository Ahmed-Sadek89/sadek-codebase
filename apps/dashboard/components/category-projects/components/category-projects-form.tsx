"use client";

import { useEffect } from "react";
import type { CategoryProject } from "@repo/types/category-projects";
import { useTranslations } from "next-intl";
import { Controller } from "react-hook-form";
import { Button } from "@repo/ui/button";
import { Eye } from "@repo/ui/icons";
import { AppDialog } from "../../ui/dialog";
import { BaseInput } from "../../ui/forms/base-input";
import { BaseSwitch } from "../../ui/forms/base-switch";
import { useCategoryProjectForm } from "../hooks/use-category-project-form";
import { toCategoryProjectFormInput } from "../utils/constants";
import {
    CATEGORY_PROJECT_NAME_MAX,
    CATEGORY_PROJECT_RANK_MIN,
} from "../schema";
import { LucideIcon } from "@repo/ui/icons";

export type CategoryProjectsFormProps = {
    isOpenDialog: boolean;
    handleOpenDialog: (open: boolean) => void;
    /** Dialog header content, e.g. `<CategoryProjectsHeaderForm />`. */
    title: string,
    description?: string,
    Icon: LucideIcon,
    role?: "edit" | "create"
    /** The selected row when editing; its values fill the inputs. */
    defaultValues?: CategoryProject | null;

};

/** Create/edit-category dialog: English/Arabic names, rank and an active switch. */
export function CategoryProjectsForm({
    isOpenDialog,
    handleOpenDialog,
    title,
    description = "",
    Icon,
    role = "create",
    defaultValues = null,
}: CategoryProjectsFormProps) {
    const t = useTranslations();
    const { form, onSubmit } = useCategoryProjectForm({
        category: defaultValues,
        onSuccess: () => handleOpenDialog(false),
    });
    const { errors, isSubmitting } = form.formState;

    // Fill the inputs each time the dialog opens: the selected row when
    // editing, blank when creating. Not on close, so fields don't flash empty
    // during the close animation.
    useEffect(() => {
        if (isOpenDialog) form.reset(toCategoryProjectFormInput(defaultValues));
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
                        label={t("categoryProjectFormNameEnLabel")}
                        placeholder={t("categoryProjectFormNameEnPlaceholder")}
                        dir="ltr"
                        maxLength={CATEGORY_PROJECT_NAME_MAX}
                        required
                        disabled={isSubmitting}
                        error={errors.nameEn?.message}
                        {...form.register("nameEn")}
                    />
                    <BaseInput
                        id="nameAr"
                        label={t("categoryProjectFormNameArLabel")}
                        placeholder={t("categoryProjectFormNameArPlaceholder")}
                        dir="rtl"
                        maxLength={CATEGORY_PROJECT_NAME_MAX}
                        required
                        disabled={isSubmitting}
                        error={errors.nameAr?.message}
                        {...form.register("nameAr")}
                    />
                    <BaseInput
                        id="rank"
                        type="number"
                        inputMode="numeric"
                        min={CATEGORY_PROJECT_RANK_MIN}
                        step={1}
                        label={t("categoryProjectFormRankLabel")}
                        description={t("categoryProjectFormRankHint")}
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
                            label={t("categoryProjectFormActiveLabel")}
                            description={t("categoryProjectFormActiveHint")}
                            icon={<Eye className="size-4" />}
                            checkedText={t("categoryProjectFormActiveOn")}
                            uncheckedText={t("categoryProjectFormActiveOff")}
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
                        {t("categoryProjectFormCancel")}
                    </Button>
                    <Button type="submit"
                        variant={role === "create" ? "success" : "default"}
                        disabled={isSubmitting}>
                        {role === "create"
                            ? t("categoryProjectFormSubmit")
                            : t("categoryProjectFormEditSubmit")}
                    </Button>
                </div>
            </form>
        </AppDialog>
    );
}
