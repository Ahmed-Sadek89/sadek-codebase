"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Card } from "@repo/ui/card";
import { Hash, Mail } from "@repo/ui/icons";
import { ProfileAvatar, ProfileCover } from "./profile-media";

type ProfileHeroProps = {
  id: number;
  username: string;
  email: string;
  avatarSrc: string | null | undefined;
  coverSrc: string | null | undefined;
  /** Shown at the end of the identity row, e.g. the Edit button. */
  action?: ReactNode;
  /** A small label over the cover, e.g. "Live preview" in the form. */
  badge?: ReactNode;
};

/** Cover, avatar, and identity: the top of both the view and the form. */
export function ProfileHero({
  id,
  username,
  email,
  avatarSrc,
  coverSrc,
  action,
  badge,
}: ProfileHeroProps) {
  const t = useTranslations();

  return (
    <Card className="gap-0 overflow-hidden py-0">
      <div className="relative">
        <ProfileCover src={coverSrc} alt={t("profileCoverAlt")} />
        {badge && <div className="absolute start-4 top-4">{badge}</div>}
      </div>
      <div className="flex flex-col gap-4 px-4 pb-5 sm:flex-row sm:items-end sm:px-6 sm:pb-6">
        <ProfileAvatar src={avatarSrc} name={username} className="-mt-12 sm:-mt-14" />
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h2 dir="auto" className="truncate text-xl font-semibold sm:text-2xl">
              {username || "—"}
            </h2>
            <span className="inline-flex items-center gap-0.5 rounded-md bg-secondary px-2 py-0.5 text-xs font-medium tabular-nums text-secondary-foreground">
              <Hash className="size-3" aria-hidden />
              <span className="sr-only">{t("profileUserId")}</span>
              {id}
            </span>
          </div>
          <p className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
            <Mail className="size-4 shrink-0" aria-hidden />
            <span dir="ltr" className="truncate">
              {email || "—"}
            </span>
          </p>
        </div>
        {action && <div className="shrink-0 sm:self-end">{action}</div>}
      </div>
    </Card>
  );
}
