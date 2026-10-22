"use client";

import { useFormatter, useTranslations } from "next-intl";
import type { CurrentUser } from "@repo/types/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import { cn } from "@repo/ui/utils";
import { PROFILE_DATES } from "../utils/constants";

type ProfileActivityProps = {
  user: CurrentUser;
};

/** Sign-up, last sign in, and last sign out as a vertical timeline. */
export function ProfileActivity({ user }: ProfileActivityProps) {
  const t = useTranslations();
  const format = useFormatter();

  return (
    <Card className="gap-4">
      <CardHeader>
        <CardTitle>{t("profileActivity")}</CardTitle>
        <p className="text-sm text-muted-foreground">
          {t("profileActivityHint")}
        </p>
      </CardHeader>
      <CardContent>
        <ol className="relative space-y-5 before:absolute before:inset-y-2 before:start-4 before:w-px before:bg-border">
          {PROFILE_DATES.map(({ field, labelKey, icon: Icon }) => {
            const value = user[field];
            const date = value ? new Date(value) : null;
            return (
              <li key={field} className="relative flex gap-3">
                <span
                  className={cn(
                    "relative flex size-8 shrink-0 items-center justify-center rounded-full ring-4 ring-card",
                    date
                      ? "bg-primary-muted text-primary"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  <Icon className="size-4 rtl:-scale-x-100" aria-hidden />
                </span>
                <div className="min-w-0 pt-0.5">
                  <p className="text-sm text-muted-foreground">{t(labelKey)}</p>
                  {date ? (
                    <p className="font-medium">
                      <time dateTime={value ?? undefined}>
                        {format.dateTime(date, { dateStyle: "medium" })}
                        <span className="ms-2 text-sm font-normal text-muted-foreground">
                          {format.dateTime(date, { timeStyle: "short" })}
                        </span>
                      </time>
                    </p>
                  ) : (
                    <p className="font-medium text-muted-foreground">
                      {t("profileNever")}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </CardContent>
    </Card>
  );
}
