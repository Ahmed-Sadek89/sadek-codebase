"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useMe } from "@repo/hooks/auth";
import { Button } from "@repo/ui/button";
import { KeyRound, Pencil } from "@repo/ui/icons";
import { ProfileSkeleton } from "../ui/skeleton/profile-skeleton";
import { ChangePasswordDialog } from "./components/change-password-dialog";
import { ProfileActivity } from "./components/profile-activity";
import { ProfileDetails } from "./components/profile-details";
import { ProfileError } from "./components/profile-error";
import { ProfileForm } from "./components/profile-form";
import { ProfileHeader } from "./components/profile-header";
import { ProfileHero } from "./components/profile-hero";

/**
 * The signed-in user (GET /auth/me): a profile card with account details and
 * activity, and an Edit button that swaps them for the form.
 */
export default function ProfilePage() {
  const t = useTranslations();
  const { data, isPending, isFetching, refetch } = useMe();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  if (isPending) return <ProfileSkeleton />;

  return (
    <main className="mx-auto w-full max-w-6xl space-y-6">
      <ProfileHeader />
      {!data ? (
        <ProfileError onRetry={() => void refetch()} isRetrying={isFetching} />
      ) : isEditing ? (
        <ProfileForm
          user={data}
          onCancel={() => setIsEditing(false)}
          onSaved={() => setIsEditing(false)}
        />
      ) : (
        <>
          <ProfileHero
            id={data.id}
            username={data.username}
            email={data.email}
            avatarSrc={data.avatarUrl}
            coverSrc={data.coverPhotoUrl}
            action={
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  type="button"
                  variant="warning"
                  onClick={() => setIsChangingPassword(true)}
                  className="w-full sm:w-auto flex items-center gap-x-2"
                >
                  <KeyRound className="size-4" aria-hidden />
                  {t("profileChangePassword")}
                </Button>
                <Button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="w-full sm:w-auto flex items-center gap-x-2"
                >
                  <Pencil className="size-4" aria-hidden />
                  {t("profileEdit")}
                </Button>
              </div>
            }
          />
          <ChangePasswordDialog
            open={isChangingPassword}
            onOpenChange={setIsChangingPassword}
            email={data.email}
          />
          <div className="grid gap-6 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <ProfileDetails user={data} />
            </div>
            <div className="lg:col-span-2">
              <ProfileActivity user={data} />
            </div>
          </div>
        </>
      )}
    </main>
  );
}
