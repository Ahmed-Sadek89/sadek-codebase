import { useTranslations } from "next-intl";
import { Skeleton } from "@repo/ui/skeleton";
import {
  PROFILE_DATES,
  PROFILE_DETAILS,
} from "../../../profile/utils/constants";

/** Loading placeholder shaped like the profile view (also the page's Suspense fallback). */
export function ProfileSkeleton() {
  const t = useTranslations();

  return (
    <div aria-busy="true" className="mx-auto w-full max-w-6xl space-y-6">
      <span className="sr-only">{t("tableLoading")}</span>
      <div className="space-y-2">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-full max-w-md" />
      </div>
      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <Skeleton className="h-32 rounded-none sm:h-44" />
        <div className="flex flex-col gap-4 px-4 pb-5 sm:flex-row sm:items-end sm:px-6 sm:pb-6">
          <Skeleton className="-mt-12 size-24 rounded-full ring-4 ring-card sm:-mt-14 sm:size-28" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-64 max-w-full" />
          </div>
          <Skeleton className="h-10 w-full sm:w-24" />
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="space-y-4 rounded-xl border bg-card p-6 shadow-sm lg:col-span-3">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-4 w-56 max-w-full" />
          <div className="divide-y divide-border rounded-lg border bg-surface">
            {PROFILE_DETAILS.map(({ field }) => (
              <div key={field} className="flex items-center gap-4 px-4 py-3">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-40" />
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-5 rounded-xl border bg-card p-6 shadow-sm lg:col-span-2">
          <Skeleton className="h-5 w-32" />
          {PROFILE_DATES.map(({ field }) => (
            <div key={field} className="flex items-center gap-3">
              <Skeleton className="size-8 rounded-full" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-4 w-36" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
