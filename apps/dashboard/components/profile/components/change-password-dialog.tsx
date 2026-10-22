"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@repo/ui/button";
import { KeyRound } from "@repo/ui/icons";
import { AppDialog } from "../../ui/dialog";
import { PasswordInput } from "../../ui/forms/password-input";
import {
  CHANGE_PASSWORD_DEFAULT_VALUES,
  useChangePasswordForm,
} from "../hooks/use-change-password-form";
import { PASSWORD_MAX } from "../schema";

type ChangePasswordDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The signed-in user's email, sent with the passwords. */
  email: string;
};

/** Current, new, and confirm password fields; submits PATCH /auth/change-password. */
export function ChangePasswordDialog({
  open,
  onOpenChange,
  email,
}: ChangePasswordDialogProps) {
  const t = useTranslations();
  const { form, onSubmit } = useChangePasswordForm({
    email,
    onSuccess: () => onOpenChange(false),
  });
  const { errors, isSubmitting } = form.formState;
  // Start blank each time the dialog opens; not on close, so the fields
  // don't flash empty during the close animation.
  useEffect(() => {
    if (open) form.reset(CHANGE_PASSWORD_DEFAULT_VALUES);
  }, [open, form]);

  return (
    <AppDialog
      open={open}
      onOpenChange={onOpenChange}
      className="sm:max-w-md"
      title={t("profileChangePassword")}
      description={t("profileChangePasswordHint")}
      Icon={KeyRound}
    >
      <form
        onSubmit={onSubmit}
        noValidate
        className="space-y-5"
        aria-busy={isSubmitting}
      >
        <div className="space-y-4">
          <PasswordInput
            id="password"
            label={t("profileCurrentPasswordLabel")}
            autoComplete="current-password"
            dir="ltr"
            required
            disabled={isSubmitting}
            error={errors.password?.message}
            {...form.register("password")}
          />
          <PasswordInput
            id="newPassword"
            label={t("profileNewPasswordLabel")}
            autoComplete="new-password"
            dir="ltr"
            maxLength={PASSWORD_MAX}
            required
            disabled={isSubmitting}
            aria-describedby="newPassword-rules"
            error={errors.newPassword?.message}
            {...form.register("newPassword")}
          />
          <p
            id="newPassword-rules"
            className="-mt-2 text-xs text-muted-foreground"
          >
            {t("profilePasswordRules")}
          </p>
          <PasswordInput
            id="confirmPassword"
            label={t("profileConfirmPasswordLabel")}
            autoComplete="new-password"
            dir="ltr"
            maxLength={PASSWORD_MAX}
            required
            disabled={isSubmitting}
            error={errors.confirmPassword?.message}
            {...form.register("confirmPassword")}
          />
        </div>
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline-danger"
            disabled={isSubmitting}
            onClick={() => onOpenChange(false)}
          >
            {t("profileCancel")}
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {t("profilePasswordSubmit")}
          </Button>
        </div>
      </form>
    </AppDialog>
  );
}
