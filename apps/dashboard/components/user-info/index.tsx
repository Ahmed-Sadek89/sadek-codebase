"use client";

import { useState } from "react";
import { useMyUserInfo } from "@repo/hooks/user-info";
import { isNotFoundError } from "./utils/constants";
import { UserInfoEmpty } from "./components/user-info-empty";
import { UserInfoError } from "./components/user-info-error";
import { UserInfoForm } from "./components/user-info-form";
import { UserInfoHeader } from "./components/user-info-header";
import { UserInfoSkeleton } from "../ui/skeleton/user-info-skeleton";
import { UserInfoView } from "./components/user-info-view";

/**
 * The signed-in user's info (GET /user-info/me): a read-only view with an
 * Edit button that swaps it for the form. A 404 means no row yet, so the
 * page offers to create one instead.
 */
export default function UserInfoPage() {
  const { data, error, isPending, isError, isFetching, refetch } =
    useMyUserInfo();
  const [isEditing, setIsEditing] = useState(false);
  const isMissing = isError && isNotFoundError(error);

  if (isPending) return <UserInfoSkeleton />;

  const stopEditing = () => setIsEditing(false);
  const canEdit = Boolean(data) && !isEditing;

  return (
    <main className="mx-auto w-full max-w-6xl space-y-6">
      <UserInfoHeader onEdit={canEdit ? () => setIsEditing(true) : undefined} />
      {isEditing ? (
        <UserInfoForm
          userInfo={data ?? null}
          onCancel={stopEditing}
          onSaved={stopEditing}
        />
      ) : data ? (
        <UserInfoView userInfo={data} />
      ) : isMissing ? (
        <UserInfoEmpty onCreate={() => setIsEditing(true)} />
      ) : (
        <UserInfoError onRetry={() => void refetch()} isRetrying={isFetching} />
      )}
    </main>
  );
}
