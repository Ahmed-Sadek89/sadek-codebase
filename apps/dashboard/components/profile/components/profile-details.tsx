"use client";

import { useTranslations } from "next-intl";
import type { CurrentUser } from "@repo/types/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import { cn } from "@repo/ui/utils";
import { PROFILE_DETAILS } from "../utils/constants";

type ProfileDetailsProps = {
  user: CurrentUser;
};

/** The account fields as label/value rows, plus whether each image is set. */
export function ProfileDetails({ user }: ProfileDetailsProps) {
  const t = useTranslations();

  return (
    <Card className="gap-4">
      <CardHeader>
        <CardTitle>{t("profileDetails")}</CardTitle>
        <p className="text-sm text-muted-foreground">
          {t("profileDetailsHint")}
        </p>
      </CardHeader>
      <CardContent>
        <dl className="divide-y divide-border rounded-lg border bg-surface">
          {PROFILE_DETAILS.map(({ field, labelKey, icon: Icon, kind }) => {
            const value = user[field];
            return (
              <div
                key={field}
                className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:gap-4"
              >
                <dt className="flex items-center gap-2 text-sm text-muted-foreground sm:w-40 sm:shrink-0">
                  <Icon className="size-4 shrink-0" aria-hidden />
                  {t(labelKey)}
                </dt>
                <dd className="min-w-0 font-medium">
                  {kind === "image" ? (
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs",
                        value
                          ? "border-success text-success"
                          : "border-border bg-muted text-muted-foreground",
                      )}
                    >
                      <span
                        className={cn(
                          "size-1.5 rounded-full",
                          value ? "bg-success" : "bg-muted-foreground",
                        )}
                        aria-hidden
                      />
                      {value ? t("profileImageSet") : t("profileImageNotSet")}
                    </span>
                  ) : (
                    <span
                      dir={kind === "ltr" ? "ltr" : "auto"}
                      className="block truncate tabular-nums"
                    >
                      {value}
                    </span>
                  )}
                </dd>
              </div>
            );
          })}
        </dl>
      </CardContent>
    </Card>
  );
}
