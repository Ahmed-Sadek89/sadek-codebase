"use client";

import { useTranslations } from "next-intl";
import type { UserInfoDetails } from "@repo/types/user-info";
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { LoaderCircle, Save, X } from "@repo/ui/icons";
import { useUserInfoForm } from "../hooks/use-user-info-form";
import { LinksFields } from "./links-fields";
import { PhoneFields } from "./phone-fields";
import { ProfileFields } from "./profile-fields";
import { StatsFields } from "./stats-fields";

type UserInfoFormProps = {
  /** The saved row to edit; null creates the first one. */
  userInfo: UserInfoDetails | null;
  /** Leaves the form without saving. */
  onCancel: () => void;
  /** Runs after a successful save. */
  onSaved: () => void;
};

/** Create/edit form for the user's info: profile texts, counters, phone numbers, then links and CV. */
export function UserInfoForm({
  userInfo,
  onCancel,
  onSaved,
}: UserInfoFormProps) {
  const t = useTranslations();
  const { form, onSubmit, setCvSource, isPending } = useUserInfoForm({
    userInfo,
    onSuccess: onSaved,
  });
  const isCreate = userInfo === null;

  return (
    <Card className="px-4 sm:px-6">
      <form
        onSubmit={onSubmit}
        noValidate
        aria-busy={isPending}
        className="space-y-6"
      >
        <div className="space-y-1 border-b border-border pb-4">
          <h2 className="text-lg font-semibold">
            {isCreate ? t("userInfoCreateTitle") : t("userInfoEditTitle")}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t("userInfoFormHint")}
          </p>
        </div>

        <ProfileFields form={form} disabled={isPending} />
        <StatsFields form={form} disabled={isPending} />
        <PhoneFields form={form} disabled={isPending} />
        <LinksFields
          form={form}
          disabled={isPending}
          setCvSource={setCvSource}
        />

        <div className="flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={onCancel}
          >
            <X className="size-4" aria-hidden />
            {t("userInfoCancel")}
          </Button>
          <Button
            type="submit"
            variant={isCreate ? "success" : "default"}
            disabled={isPending}
          >
            {isPending ? (
              <LoaderCircle className="size-4 animate-spin" aria-hidden />
            ) : (
              <Save className="size-4" aria-hidden />
            )}
            {isCreate ? t("userInfoCreateSubmit") : t("userInfoSave")}
          </Button>
        </div>
      </form>
    </Card>
  );
}
