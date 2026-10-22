"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useMe } from "@repo/hooks/auth";
import { Button } from "@repo/ui/button";
import { Pencil } from "@repo/ui/icons";
import { ProfileSkeleton } from "../ui/skeleton/profile-skeleton";
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

  if (isPending) return <ProfileSkeleton />;

  return (
    <main className="mx-auto w-full max-w-6xl space-y-6">
      <ProfileHeader />
      {!data ? (
        <ProfileError onRetry={() => void refetch()} isRetrying={isFetching} />
      ) : isEditing ? (
        <ProfileForm user={data} onCancel={() => setIsEditing(false)} />
      ) : (
        <>
          <ProfileHero
            id={data.id}
            username={data.username}
            email={data.email}
            avatarSrc={data.avatarUrl}
            coverSrc={data.coverPhotoUrl}
            action={
              <Button
                type="button"
                onClick={() => setIsEditing(true)}
                className="w-full sm:w-auto"
              >
                <Pencil className="size-4" aria-hidden />
                {t("profileEdit")}
              </Button>
            }
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
